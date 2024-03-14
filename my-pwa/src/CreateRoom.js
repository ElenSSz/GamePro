import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import 'semantic-ui-css/semantic.min.css';
import { Link } from 'react-router-dom';
import { Button, Grid,Icon } from 'semantic-ui-react';

const CreateRoomPage = () => {
  const [roomName, setRoomName] = useState('');
  const [task, setTask] = useState('');
  const [fetchedUser, setFetchedUser] = useState(null);

  useEffect(() => {

    
      const fetchUserFromDatabase = async () => {
        try {
          const dbName = 'Game';
          const dbVersion = 1;
          const request = indexedDB.open(dbName, dbVersion);
  
          request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['uzytkownicy'], 'readonly');
            const store = transaction.objectStore('uzytkownicy');
  
            const getUserRequest = store.openCursor();
  
            getUserRequest.onsuccess = (event) => {
              const cursor = event.target.result;
  
              if (cursor) {
                const userData = cursor.value;
                setFetchedUser(userData.serverid);
              } else {
                console.log('Brak użytkowników w bazie danych.');
              }
            };
          };
  
          request.onerror = (error) => {
            console.error('Błąd otwierania bazy danych:', error.target.error);
          };
        } catch (error) {
          console.error('Błąd pobierania użytkownika z bazy danych:', error);
        }
      };
  

    const fetchTaskFromDatabase = async () => {
      try {
        const dbName = 'Game';
        const dbVersion = 1;
        const request = indexedDB.open(dbName, dbVersion);


        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction(['inne_dane'], 'readonly');
          const store = transaction.objectStore('inne_dane');
          
     
          const getAllItemsRequest = store.getAll();
          
          getAllItemsRequest.onsuccess = () => {
            const task = getAllItemsRequest.result;
            setTask(task);
           
            if (task.length > 0) {
             
              console.log('task bazie danych.');
            } else {
              console.log('Brak task w bazie danych.');
            }
          };
        };

      
        request.onerror = (error) => {
          console.error('Błąd otwierania bazy danych:', error.target.error);
        };
      } catch (error) {
        console.error('Błąd pobierania użytkowników z bazy danych:', error);
      }
    };
    fetchTaskFromDatabase();
    fetchUserFromDatabase();
  }, []);

  const handleCreateRoom = () => {
    const socket = io('http://localhost:3000/createRoom'); 

    socket.emit('createRoom', { roomName, task, fetchedUser });

    socket.on('roomCreationResponse', (roomId) => {
      console.log(`Room created with ID: ${roomId}`);
     
    });
  };

  return (
    <div className="grid-container" style={{ textAlign: 'center', marginTop: '20px' }}>
      <Link to='/'>
        <Button color='red' style={{ position: 'absolute', left: '10px', top: '10px' }}>
          <Icon name='arrow left' />
        </Button>
      </Link>
      <Grid textAlign='center' verticalAlign='middle' style={{ height: '100vh' }}>
        <Grid.Column style={{ width: '80%', maxWidth: '600px', display: 'flex'  }}>
      <h1>Create Room</h1>
      <form>
        <label>
          Room Name:
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
        </label>
       <br/>
        <br />
        <button type="button" onClick={handleCreateRoom}>
          Create Room
        </button>
      </form>
      </Grid.Column>
      </Grid>
    </div>
  );
};

export default CreateRoomPage;
