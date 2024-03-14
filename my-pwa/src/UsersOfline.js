import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input,Dropdown, Grid, Icon } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';


const NewUserForm = () => {
  const [nazwaUzytkownika, setNazwaUzytkownika] = useState('');
  const [plec, setPlec] = useState('mezczyzna');
  const [uzytkownicy, setUzytkownicy] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [hasUser, setUser] = useState(false);

const numberUser=async (user)=>{
  if (user.length >= 2){
    console.log(user.length);
    setUser(true);
  }else{
    console.log(user.length);
    setUser(false);}
}

  const fetchData = async () => {
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
          setUzytkownicy(getAllRequest.result);
          console.log(getAllRequest.result);
          numberUser(getAllRequest.result);
        };

        getAllRequest.onerror = (error) => {
          console.error('Błąd pobierania danych z bazy:', error.target.error);
         
        };
      };

      request.onerror = (error) => {
        console.error('Błąd otwierania bazy danych:', error.target.error);
       
      };
    } catch (error) {
      console.error('Błąd pobierania użytkowników:', error);
    }
    
  };
  const fetchDataAndCheckUser = async () => {
    await fetchData();
  };

  useEffect(() => {
    fetchDataAndCheckUser();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      const dbName = 'Game';
      const dbVersion = 1;
      const request = indexedDB.open(dbName, dbVersion);

      // Open IndexedDB
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['uzytkownicy'], 'readwrite');
        const store = transaction.objectStore('uzytkownicy');
        const deleteRequest = store.delete(userId);

        deleteRequest.onsuccess = () => {
          console.log('Usunięto użytkownika z bazy danych.');
          fetchData();
        };
      };
      request.onerror = (error) => {
        console.error('Błąd otwierania bazy danych:', error.target.error);
      };
    } catch (error) {
      console.error('Błąd usuwania użytkownika:', error);
    }
    
  };
  const handleDeleteUserId= async (userId) =>{
    await handleDeleteUser(userId);
  };

  const handleEditUser = (userId) => {
    setEditingUserId(userId);
    const editedUser = uzytkownicy.find((user) => user.id === userId);
    setNazwaUzytkownika(editedUser.nazwaUzytkownika);
    setPlec(editedUser.plec);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setNazwaUzytkownika('');
    setPlec('mezczyzna');
  };

  const handleSaveEdit = async () => {
    try {
      const dbName = 'Game';
      const dbVersion = 1;
      const request = indexedDB.open(dbName, dbVersion);
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['uzytkownicy'], 'readwrite');
        const store = transaction.objectStore('uzytkownicy');
        const editedUser = {
          id: editingUserId,
          nazwaUzytkownika,
          plec,
        };
        const editRequest = store.put(editedUser);
        editRequest.onsuccess = () => {
          console.log('Zaktualizowano użytkownika w bazie danych.');
          setEditingUserId(null);
          setNazwaUzytkownika('');
          setPlec('mezczyzna');
          fetchData(); 
        };
      };
      request.onerror = (error) => {
        console.error('Błąd otwierania bazy danych:', error.target.error);
      };
    } catch (error) {
      console.error('Błąd edycji użytkownika:', error);
    }
  };

  const AddNewUser = async () => {
    try {
      const dbName = 'Game';
      const dbVersion = 1;
      const request = indexedDB.open(dbName, dbVersion);
      const serverid = " ";
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['uzytkownicy'], 'readwrite');
        const store = transaction.objectStore('uzytkownicy');
        if (!db.objectStoreNames.contains('uzytkownicy')) {
          db.createObjectStore('uzytkownicy', { keyPath: 'id', autoIncrement: true });
        }
        const addUserRequest = store.add({ nazwaUzytkownika, plec, serverid });
        addUserRequest.onsuccess = () => {
          console.log('Dodano użytkownika do bazy danych.');
          setNazwaUzytkownika('');
          setPlec('mezczyzna');
          fetchData(); 
        };
      };
      request.onerror = (error) => {
        console.error('Błąd otwierania bazy danych:', error.target.error);
      };
    } catch (error) {
      console.error('Błąd rejestracji:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUserId !== null) {
        handleSaveEdit();
      } else {
        await AddNewUser();
      }
    } catch (error) {
      console.error('Błąd dodawania/edytowania użytkownika:', error);
    }
  };

  const genderOptions = [
    { key: 'male', text: 'Mężczyzna', value: 'mezczyzna' },
    { key: 'female', text: 'Kobieta', value: 'kobieta' },
  ];
    return (
      <div>
         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Link to='/'>
          <Button>
          <Icon name='arrow left' />
          </Button>
        </Link>

       {hasUser ? <Link to='/play'>
          <Button>
          <Icon name='arrow right' />
          </Button>
        </Link>:""}
        </div>

<Grid textAlign='center' verticalAlign='middle' style={{ height: '100vh' }}>
    <Grid.Column style={{ width: '80%', maxWidth: '600px' }}>
      <div>
        <Input
          label="Nazwa Użytkownika:"
          placeholder="Wprowadź nazwę użytkownika"
          value={nazwaUzytkownika}
          onChange={(e) => setNazwaUzytkownika(e.target.value)}
        />
  
        <Dropdown
          label="Płeć:"
          selection
          options={genderOptions}
          value={plec}
          onChange={(e, { value }) => setPlec(value)}
        />
  
        <Button primary onClick={handleSubmit}>
          {editingUserId !== null ? 'Zapisz' : 'Dodaj'}
        </Button>
        </div>
        {editingUserId !== null && (
          <Button onClick={handleCancelEdit}>
            Anuluj
          </Button>
        )}
  
 
        {editingUserId !== null && (
          <div>
            <h2>Edytujesz użytkownika:</h2>
            <p>ID: {editingUserId}</p>
          </div>
        )}
<div>
      <h2>Użytkownicy z bazy danych:</h2>
      <ul>
        {uzytkownicy.map((uzytkownik) => (
          <li key={uzytkownik.id} style={{ display: 'flex', alignItems: 'center' }}>
            <span>{uzytkownik.nazwaUzytkownika} - {uzytkownik.plec}</span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '5px' }}>
              {uzytkownik.id !== 1 && (
                <Button negative onClick={() => handleDeleteUserId(uzytkownik.id)}>
                  Usuń
                </Button>
              )}
              {uzytkownik.id !== 1 && (
                <Button onClick={() => handleEditUser(uzytkownik.id)}>
                  Edytuj
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
        </Grid.Column>
  </Grid>
      </div>

    );
  };


export default NewUserForm;
