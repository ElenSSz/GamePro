import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input,Dropdown, Grid, Icon } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'; 

const FormularzDodawaniaZadania = () => {
  const [nazwa, setNazwa] = useState('');
  const [opis, setOpis] = useState('');
  const [slowa, setSlowa] = useState('');
  const [plec, setPlec] = useState('wszystkie'); // Dodana stała dla płci
  const [plecv2, setPlecv] = useState('');
  const [level, setLevel] = useState(1);
  const DodajZadanieDoBazy = async () => {
    try {
      const dbName = 'Game';
      const dbVersion = 1;
      const request = indexedDB.open(dbName, dbVersion);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('inne_dane')) {
          db.createObjectStore('inne_dane', { keyPath: 'id', autoIncrement: true });
        }
      };

      return new Promise((resolve, reject) => {
        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction(['inne_dane'], 'readwrite');
          const store = transaction.objectStore('inne_dane');

          const noweZadanie = { level,nazwa, opis, slowa, plec, plecv2 };
          const dodajZadanieRequest = store.add(noweZadanie);

          dodajZadanieRequest.onsuccess = () => {
            resolve();
          };

          dodajZadanieRequest.onerror = (error) => {
            reject(error.target.error);
          };
        };

        request.onerror = (event) => {
          reject(event.target.error);
        };
      });
    } catch (error) {
      console.error('Błąd dodawania zadania do bazy:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await DodajZadanieDoBazy();
      setNazwa('');
      setOpis('');
      setSlowa('');
      setLevel(1);
      setPlec('wszystkie'); 
      setPlecv(' '); 
    } catch (error) {
      console.error('Błąd dodawania zadania:', error);
    }
  };

  const genderOptions = [
    { key: 'male', text: 'Mężczyzna', value: 'mezczyzna' },
    { key: 'female', text: 'Kobieta', value: 'kobieta' },
    {key:'all',text:'Wszystkie',value:'wszystkie'},
  ];

  const genderOptionsv2 = [
    { key: 'male', text: 'Mężczyzna', value: 'mezczyzna' },
    { key: 'female', text: 'Kobieta', value: 'kobieta' },
    {key:'all',text:'Brak',value:' '},
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Link to='/option'>
          <Button color='red'>
          <Icon name='arrow left' />
          </Button>
        </Link>
        </div>
        <span style={{ margin: '5%' }}></span>
        <Grid textAlign='center' verticalAlign='middle' style={{ height: '100vh' }}>
    <Grid.Column style={{ width: '80%', maxWidth: '600px' }}>
      <h1>Add Task</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nazwa:
          <Input type="text" value={nazwa} onChange={(e) => setNazwa(e.target.value)} />
        </label>
        <br />
        <br />
        <label>
          Opis:
          <Input value={opis} onChange={(e) => setOpis(e.target.value)} />
        </label>
        <br />
        <br />
        <label>
          Słowa:
          <Input type="text" value={slowa} onChange={(e) => setSlowa(e.target.value)} />
        </label>
        <br />
        <br />
        <label>
        Level:
        <Input type="number" value={level} onChange={(e) => setLevel(e.target.value)} />
        </label>
        <br />
        <br />
        <label>
          Płec
        <Dropdown
          label="Płeć:"
          selection
          options={genderOptions}
          value={plec}
          onChange={(e, { value }) => setPlec(value)}
        />
        </label>
        <br/>
        <br />
        <label>
        Płec v2
        <Dropdown
          label="Płeć:"
          selection
          options={genderOptionsv2}
          value={plecv2}
          onChange={(e, { value }) => setPlecv(value)}
        />
        </label>
  <br/>
  <br />
  <span style={{ margin: '5%' }}></span>
        <Button type="submit">Dodaj Zadanie</Button>
      </form>
      </Grid.Column>
      </Grid>
    </div>
  );
};

export default FormularzDodawaniaZadania;
