import React, { useState } from 'react';
import io from 'socket.io-client';
import { Button, Input,Dropdown, Grid, Icon } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

const RegistrationForm = ({ updateParent }) => {
  const [nazwaUzytkownika, setNazwaUzytkownika] = useState('');
  const [plec, setPlec] = useState('mezczyzna');

  const handleRegister = async () => {
    try {
      const dbName = 'Game';
      const dbVersion = 1;
      const request = indexedDB.open(dbName, dbVersion);
      const serverid =" "

      // Open IndexedDB
      request.onsuccess = (event) => {
        const db = event.target.result;

        // Handle the rest of your operations inside this success callback

        const transaction = db.transaction(['uzytkownicy'], 'readwrite');
        const store = transaction.objectStore('uzytkownicy');

        if (!db.objectStoreNames.contains('uzytkownicy')) {
          db.createObjectStore('uzytkownicy', { keyPath: 'id', autoIncrement: true });
        }

     

        const addUserRequest = store.add({ nazwaUzytkownika, plec, serverid});

        addUserRequest.onsuccess = () => {
          console.log('Dodano użytkownika do bazy danych.');
        };
        const socket = io('http://localhost:3000/userData');

      socket.emit('registerUser', { nazwaUzytkownika, plec });
      
      socket.on('registrationResponse', (response) => {
        const transaction = db.transaction(['uzytkownicy'], 'readwrite');
        const store = transaction.objectStore('uzytkownicy');
      
        const cursorRequest = store.openCursor();
        cursorRequest.onsuccess = (event) => {
          const cursor = event.target.result;
      
          if (cursor) {
            const getUserRequest = store.get(cursor.value.id);
            getUserRequest.onsuccess = (event) => {
              const userToUpdate = event.target.result;
              userToUpdate.serverid = response || userToUpdate.temp;
              const updateRequest = store.put(userToUpdate);
              updateRequest.onsuccess = () => {
                console.log('Zaktualizowano użytkownika w bazie danych.');
                updateParent();
              };
            };
          } else {
            console.log('Brak użytkowników w bazie danych.');
          }
        };
        console.log('Odpowiedź od serwera:', response);
      });
          const otherDataTransaction = db.transaction(['inne_dane'], 'readwrite');
          const otherDataStore = otherDataTransaction.objectStore('inne_dane');
          if (!db.objectStoreNames.contains('inne_dane')) {
            db.createObjectStore('inne_dane', { keyPath: 'id', autoIncrement: true });
          }
          const sampleData = [
            { level: 1, nazwa: 'Przykładowa Nazwa 1', opis: 'Opis dla rekordu 1', slowa: 'słowo1, słowo2', plec:'wszystkie', plecv2: 'mezczyzna' },
            { level: 1, nazwa: 'Przykładowa Nazwa 2', opis: 'Opis dla rekordu 2', slowa: 'słowo3, słowo4', plec:'wszystkie', plecv2: ' '},
          ];
          sampleData.forEach((data) => {
            const addOtherDataRequest = otherDataStore.add(data);
            addOtherDataRequest.onsuccess = () => {
              console.log('Dodano dane do tabeli "inne_dane".');
            };
          });
      };
      request.onerror = (error) => {
        console.error('Błąd otwierania bazy danych:', error.target.error);
      };
    } catch (error) {
      console.error('Błąd rejestracji:', error);
    }
  };
  
  return (
    <div>
      <Grid textAlign='center' verticalAlign='middle' style={{ height: '100vh' }}>
    <Grid.Column style={{ width: '80%', maxWidth: '600px' }}>
      <Input
        type="text"
        placeholder="Wprowadź nazwę użytkownika"
        value={nazwaUzytkownika}
        onChange={(e) => setNazwaUzytkownika(e.target.value)}
      />
      <br/>
<br/>
      <label>Płeć:</label>
      <br/>
      <select value={plec} onChange={(e) => setPlec(e.target.value)}>
        <option value="mezczyzna">Mężczyzna</option>
        <option value="kobieta">Kobieta</option>
      </select>
      <br/>
      <br/>
      <Button color='red' onClick={handleRegister}>Zarejestruj</Button>
      </Grid.Column>
      </Grid>

    </div>
  );
};

export default RegistrationForm;