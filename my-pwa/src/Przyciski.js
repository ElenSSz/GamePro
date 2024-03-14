import 'semantic-ui-css/semantic.min.css';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid } from 'semantic-ui-react';

const Przyciski = () => {
  return (
    <Grid textAlign='center' verticalAlign='middle' style={{ height: '100vh' }}>
      <Grid.Column style={{ width: '80%', maxWidth: '600px' }}>

        <img
          className="logo"
          src="logo.png"
          alt="Logo firmy"
          
        />

        <Link to='/playofline'>
          <Button color='red' fluid style={{ marginBottom: '5vh', fontSize: '1.5em' }}>
            Play Offline
          </Button>
        </Link>

        <Link to='/CreateRoom'>
        <Button color='red' fluid style={{ marginBottom: '5vh', fontSize: '1.5em' }}>
          Creata Room
        </Button>
        </Link>
        <Button color='red' fluid style={{ marginBottom: '5vh', fontSize: '1.5em' }}>
          Przycisk Warunkowy
        </Button>

        <Link to='/option'>
          <Button color='red' fluid style={{ marginBottom: '5vh', fontSize: '1.5em' }}>
            Opcje
          </Button>
        </Link>

        <Button color='red' fluid style={{ marginBottom: '5vh', fontSize: '1.5em' }} onClick={() => window.close()}>
          Exit
        </Button>
      </Grid.Column>
    </Grid>
  );
};

export default Przyciski;

