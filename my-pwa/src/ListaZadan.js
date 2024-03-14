import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

const ListaZadan = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dbName = 'Game';
        const dbVersion = 1;
        const request = indexedDB.open(dbName, dbVersion);

        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction(['inne_dane'], 'readonly');
          const store = transaction.objectStore('inne_dane');
          const getAllRequest = store.getAll();

          getAllRequest.onsuccess = () => {
            const tasksFromDB = getAllRequest.result;
            setTasks(tasksFromDB);
          };

          getAllRequest.onerror = (error) => {
            console.error('Błąd pobierania danych z bazy:', error.target.error);
          };
        };

        request.onerror = (error) => {
          console.error('Błąd otwierania bazy danych:', error.target.error);
        };
      } catch (error) {
        console.error('Błąd pobierania zadań z bazy:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
       <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Lista Zadań</h2>
        <Link to="/dodaj-zadanie">
  <Button color='red' icon labelPosition='left'>
    <Icon name='plus' />
    Add
  </Button>
</Link>
<span style={{ margin: '5%' }}></span>
      </div>
      <dl>
        <>
        {tasks.map((task) => (
          <dt key={task.id}>
            <strong>Level:</strong> {task.level}, <strong>Nazwa:</strong> {task.nazwa}, <strong>Opis:</strong> {task.opis}, <strong>Słowa:</strong> {task.slowa}, <strong>Płec:</strong> {task.plec}, <strong>Płec:</strong> {task.plecv2} 
          </dt>
        ))}
        </>
      </dl>
    </div>
  );
};

export default ListaZadan;
