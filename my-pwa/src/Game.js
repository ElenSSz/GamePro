import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SelectScreen from './SelectScreen';
import SelectTask from './SelectTask';
import { Button, Grid } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

const GamePage = () => {
  const [hasSelect, setHasSelect] = useState(true);
  const [uzytkownicy, setUzytkownicy] = useState([]);
  const [Task, setTask] = useState([]);
  const [nazwaTaks, setNazwaTask] = useState([]);
  const [nazwaTaks2, setNazwaTask2] = useState([]);
  const [nazwaUzytkownika, setNazwaUzytkownika] = useState([]);
  const [nazwaUzytkownikav2, setNazwaUzytkownikav2] = useState([]); 
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levelCount, setLevelCount] = useState(0);
  const [words, setWords] = useState([]);



  useEffect(() => {
    const fetchDataFromDatabase = async () => {
      try {
        const dbName = 'Game';
        const dbVersion = 1;
        const request = indexedDB.open(dbName, dbVersion);

        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction(['uzytkownicy'], 'readonly');
          const store = transaction.objectStore('uzytkownicy');
          
          const getAllItemsRequest = store.getAll();
          
          getAllItemsRequest.onsuccess = () => {
            const users = getAllItemsRequest.result;
            setUzytkownicy(users);


            if (users.length > 0) {
              losujUzytkownika(users);
              losujUzytkownikav2(users);
            } else {
              console.log('Brak użytkowników w bazie danych.');
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
              console.log('Brak użytkowników w bazie danych.');
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
    fetchDataFromDatabase();
  }, []);


  const funselectT=()=>{
    losujWyzwanie(currentLevel,nazwaUzytkownika,nazwaUzytkownikav2);
  }
  const funselect=()=>{
    losujWyzwanie(currentLevel,nazwaUzytkownika,nazwaUzytkownikav2);
    setHasSelect(false);
  }

  const funtask=()=>{
    losujUzytkownika(uzytkownicy);
    losujUzytkownikav2(uzytkownicy);
    setHasSelect(true);
  }


  const losujWyzwanie = ( poziom, plec, plecv2) => {
   
    const dostepneWyzwania = Task.filter((wyzwanie) => {
      return wyzwanie.level === poziom && ((wyzwanie.plec === plec.plec&&wyzwanie.plecv2 === plecv2.plec) || wyzwanie.plec === "wszystkie");
    });
    let wylosowanyIndex 
    do{
    wylosowanyIndex = Math.floor(Math.random() * dostepneWyzwania.length);
    
    }while (dostepneWyzwania.length > 0 && nazwaTaks===dostepneWyzwania[wylosowanyIndex]);
    
      setNazwaTask( dostepneWyzwania[wylosowanyIndex]);
      increaseLevelIfNeeded(nazwaTaks);
      splitTextIntoWords(dostepneWyzwania[wylosowanyIndex]);
      zamienKeyNaLosowe(dostepneWyzwania[wylosowanyIndex]);
    
  };

  const splitTextIntoWords = (text) => {
    const wordsArray = text.slowa.split(' ');
    setWords(wordsArray);
  }


  function zamienKeyNaLosowe(text) {
    let nowyTekst = text.opis.replace(/\{key\}/g, () => {
      return words[Math.floor(Math.random() * words.length)];
    });

     nowyTekst = nowyTekst.replace(/\{player\}/g, () => {
      return nazwaUzytkownikav2;
    });
  setNazwaTask2(nazwaTaks);
  nazwaTaks2.opis=nowyTekst;
  setNazwaTask2(nazwaTaks2);
  }



  const losujUzytkownika = (users) => {
    let index;
    do {
      index = Math.floor(Math.random() * users.length);
    } while (users[index] === nazwaUzytkownika);
    setNazwaUzytkownika(users[index]);
  };
  
  const losujUzytkownikav2 = (users) => {
    let index;
    do {
      index = Math.floor(Math.random() * users.length);
    } while (users[index] === nazwaUzytkownika);
    setNazwaUzytkownikav2(users[index]);
  };


  const increaseLevelIfNeeded = (task) => {
    if(task.level===currentLevel){
      setLevelCount(levelCount + 1);
      if (levelCount === 5) {
        setCurrentLevel(currentLevel + 1);
        setLevelCount(0);
      }
    }
  };




  
 
  return (
    <div>
      {hasSelect ? <SelectScreen nazwaUzytkownika={nazwaUzytkownika} FunkcjaStart={funselect} /> : <SelectTask TaskListSc={nazwaTaks2} TaskListScv2={nazwaTaks}  FunkcjaStart={funtask} temp={funselectT}/>}
    </div>
   
  );
};

export default GamePage;
