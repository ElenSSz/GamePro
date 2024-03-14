import React from 'react';
import { Link } from 'react-router-dom';
import ListaZadan from './ListaZadan';
import { Button, Icon, Grid } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

const ZadaniaPage = () => {
  return (
    <div className="grid-container" style={{ textAlign: 'center', marginTop: '20px' }}>
      <Link to='/'>
        <Button color='red' style={{ position: 'absolute', left: '10px', top: '10px' }}>
          <Icon name='arrow left' />
        </Button>
      </Link>
       
      <Grid textAlign='center' verticalAlign='middle' style={{ height: '100vh' }}>
        <Grid.Column style={{ width: '80%', maxWidth: '600px', display: 'flex'  }}>
      <ListaZadan />
      </Grid.Column>
      </Grid>
    </div>
  );
};

export default ZadaniaPage;
