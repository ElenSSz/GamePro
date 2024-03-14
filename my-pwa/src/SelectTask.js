import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, Grid } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

const SelectScreen = ({ TaskListSc,TaskListScv2, FunkcjaStart, temp }) => {
  const [hasRun, setRun] = useState(false);
  const [seconds, setSeconds] = useState(15); 
  const [isTimeOver, setTimeOver] = useState(false);
  const [haSsRun, setSRun] = useState(false);
  const handleStartClick = () => {
  FunkcjaStart();
  };

  useEffect(() => {
    let timer;

    if (hasRun && seconds > 0) {
      timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setTimeOver(true);
      setSRun(false);

    }

    return () => {
      clearInterval(timer);
    };
  }, [hasRun, seconds]);





  const startTimer = () => {
    setRun(true);
    setTimeOver(false); 
    setSRun(true);
  };




const NewTask = () =>{
temp();
};

  return (
    <div className="grid-container" style={{ textAlign: 'center', marginTop: '20px' }}>
      <Link to='/playofline'>
        <Button color='red' style={{ position: 'absolute', left: '10px', top: '10px' }}>
          <Icon name='arrow left' />
        </Button>
      </Link>
      <Grid textAlign='center' verticalAlign='middle' style={{ height: '100vh' }}>
        <Grid.Column style={{ width: '80%', maxWidth: '600px', display: 'flex'  }}>

      <h2>{TaskListSc.opis}</h2>
      <span style={{ margin: '5%' }}></span>
      {isTimeOver && <h4>Kara wypij {TaskListScv2.level} kieliszki</h4>}
       {haSsRun && <h3> {seconds} </h3>}
      <span style={{ margin: '5%' }}></span>
<div>
      {hasRun?<Button onClick={handleStartClick}>Next</Button>:<Button onClick={startTimer}>Start</Button>}
      {hasRun?"":<Button onClick={NewTask}>Change</Button>}
      </div>
      </Grid.Column>
      </Grid>
    </div>
  );
};

export default SelectScreen;