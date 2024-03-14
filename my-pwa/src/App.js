import './App.css';
import Przyciski from './Przyciski';
import React, { useState, useEffect } from 'react';
import  RegistrationForm  from './RegistrationForm';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ZadaniaPage from './option';
import FormularzDodawaniaZadania from './NoweZadanie';
import NewUserForm from './UsersOfline';
import GamePage from './Game';
import CreateRoomPage from './CreateRoom';


const App = () => {
  const [hasUser, setHasUser] = useState(false);
  const updateUserStatus = () => {
    setHasUser(true);
  };

  useEffect(() => {
    function initDatabase(dbName,objectStoreName,objectStoreName2) {
      const dbVersion = 1;
      const request = indexedDB.open(dbName, dbVersion);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(objectStoreName)) {
          db.createObjectStore(objectStoreName, { keyPath: 'id', autoIncrement: true });
          db.createObjectStore(objectStoreName2, { keyPath: 'id', autoIncrement: true });
        }
      };
      return new Promise((resolve, reject) => {
        request.onsuccess = (event) => {
          console.log('Baza danych została pomyślnie otwarta.');
          const db = event.target.result;
          resolve(db);
        };
        request.onerror = (event) => {
          console.error('Błąd otwierania bazy danych:', event.target.error);
          reject(event.target.error);
        };
      });
    }
    initDatabase().then((db) => {
    }).catch((error) => {
      console.error('Błąd inicjalizacji bazy danych:', error);
    });

    const checkUserInDatabase = async () => {
      try {
        const dbName = 'Game';
        const dbVersion = 1;
        const request = indexedDB.open(dbName, dbVersion);

        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction(['uzytkownicy'], 'readonly');
          const store = transaction.objectStore('uzytkownicy');
          const getAllRequest = store.getAll();

          getAllRequest.onsuccess = () => {
            const users = getAllRequest.result;
            if (users.length > 0) {
              setHasUser(true);
            } else {
              setHasUser(false);
            }
          };

          getAllRequest.onerror = (error) => {
            console.error('Błąd pobierania danych z bazy:', error.target.error);
          };
        };

        request.onerror = (error) => {
          console.error('Błąd otwierania bazy danych:', error.target.error);
        };
      } catch (error) {
        console.error('Błąd sprawdzania użytkownika w bazie:', error);
      }
    };
    initDatabase('Game','uzytkownicy','inne_dane');
    checkUserInDatabase();
  }, []);

  return (
  
<div>
<Router>
        <Routes>
          <Route path="/" element={hasUser ? <Przyciski /> : <RegistrationForm updateParent={updateUserStatus} />} />
          <Route path="/option" element={<ZadaniaPage />} />
          <Route path="/dodaj-zadanie" element={<FormularzDodawaniaZadania />} />
          <Route path="/playofline" element={<NewUserForm />} />
          <Route path="/play" element={<GamePage />} />
          <Route path='/CreateRoom' element={<CreateRoomPage/>}/>
        </Routes>
      </Router>
</div>

  );
};

export default App;
