import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { JSONFilePreset } from 'lowdb/node';
import e from 'express';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});
const rooms = {};


const defaultData = { userDataS: [] }
const db = await JSONFilePreset('db.json', defaultData)

io.of('/userData').on('connection', (socket) => {
  handleConnection('/userData', socket);
});

io.of('/createRoom').on('connection', (socket)=>{
  handleJoin('/createRoom', socket);
});



io.of('/join').on('connection', (socket)=>{
  handleRoomCreation('/join', socket);
});

class Room {
  constructor(roomData) {
    this.id = generateUniqueId();
    this.usersID = [];
    this.opis = roomData.opis;
    this.tasks = [];
    this.users = [];
    this.db = low(new FileSync('db.json'));
  }


  getUserById(userId) {

    const userData = this.db.get('userDataS').value();
    
    return userData.find(user => user.id === userId);
  }



  addUser(userId) {
    
    const existingUser = this.users.find(user => user.id === userId);

    if (existingUser) {
      console.log(`User with ID ${userId} already exists in the room.`);
    } else {
  
      const user = this.getUserById(userId)
      this.users.push(user);
      console.log(`User added to room: `);
    }
  }



  addTask(task) {
    this.tasks.push(task);
  }

  addUsersID(userID) {
    const existingUser = this.users.find(user => user.id === userId);
    if (existingUser) {
      this.usersID.push(userID);
      this.addUser(existingUser.id, existingUser.nazwaUzytkownika, existingUser.plec);
  }
  }


  addUser(userId, userName, gender) {
    const user = { id: userId, name: userName, gender: gender };
    this.users.push(user);
  }

  getTasks() {
    return this.tasks;
  }

  getUsers() {
    return this.users;
  }
}


function createRoom(socket, roomData) {
  return new Promise(async (resolve, reject) => {
    const newRoom = new Room(roomData);
    newRoom.id = generateUniqueId(); // Generate a random roomId
    rooms[newRoom.id] = newRoom;
    socket.join(newRoom.id);
    console.log(`Room created with id ${newRoom.id}`);
    console.log(newRoom.opis);
    socket.emit('roomCreationResponse', newRoom.id);
    resolve(newRoom.id);
    updateRoomUsers(newRoom.id);
  });
}




function updateRoomUsers(roomId) {
  const room = rooms[roomId];
  const users = room.getUsers();
  io.to(roomId).emit('updateUsers', users);
}


 // io.to(room).emit('chat message', message); // Rozsyła wiadomość tylko do klientów w danym pokoju


function handleJoin(namespace, socket){
socket.on('join', (roomId)=>{socket.join(roomId)})

}


function handleRoomCreation(namespace, socket) {
  console.log(`New connection on namespace ${namespace}:`, socket.id);

  socket.on('createRoom', (roomData) => {
    createRoom(socket, roomData)
      .then((roomId) => {
        console.log(`Room created with id ${roomId} on namespace ${namespace}`);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  });

  socket.on('disconnect', () => {
    console.log(`Disconnect on namespace ${namespace}:`, socket.id);
  });
}

function handleConnection(namespace, socket) {
  console.log(`Nowe połączenie na ścieżce ${namespace}:`, socket.id);

  socket.on('registerUser', (userData) => {
    handleUserData(socket, userData)
      .then((userId) => {
        console.log(`Zapisano użytkownika z id ${userId} na ścieżce ${namespace}`);
      })
      .catch((error) => {
        console.error('Błąd:', error);
      });
  });


  socket.on('disconnect', () => {
    console.log(`Rozłączenie na ścieżce ${namespace}:`, socket.id);
  });
}


 function handleUserData(socket, userData) {
  return new Promise(async (resolve, reject) => {
    const userId = generateUniqueId();
    await db.update(({ userDataS }) => userDataS.push({ id: userId, ...userData }))
    console.log(userId);
    socket.emit('registrationResponse', userId);
    resolve(userId);
  });
}
function generateUniqueId() {
  return Math.random().toString(36).substring(2, 10);
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});
