import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, Grid } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';


const SelectTask = ({ nazwaUzytkownika, FunkcjaStart }) => {
  const handleStartClick = () => {
    FunkcjaStart();
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
          <h1>{nazwaUzytkownika.nazwaUzytkownika}</h1>
          <span style={{ margin: '10%' }}></span>
          <Button onClick={handleStartClick}>Strat</Button>
        </Grid.Column>
      </Grid>
    </div>
  );
  
};

export default SelectTask;
