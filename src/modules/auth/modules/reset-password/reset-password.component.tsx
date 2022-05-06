import { Container, Grid, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { ForgetForm } from '@playfast/app/auth/components/forget/forget-form';
import Image from '@playfast/assets/images/background.png';
import Logo from '@playfast/assets/images/logo.png';
import React from 'react';
import { FunctionComponent } from 'react';

const styles = {
  container: {
    backgroundImage: `url(${Image})`,
    flex: 1,
    minHeight: '100vh',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    overflow: 'hidden',
  },
  logo: {
    height: '100%',
  },
  card: {
    backgroundColor: '#171C27',
  },
};

const ResetPassword: FunctionComponent = () => {
  return (
    <>
      <Container maxWidth={false} style={styles.container}>
        <Grid container direction="column" justifyContent="center" alignItems="center" mt={10}>
          <Grid item justifyContent="center" style={styles.logo}>
            <img src={Logo} />
          </Grid>
          <Grid item justifyContent="center" style={styles.logo} mt={10}>
            <Card sx={{ maxWidth: '520px', minWidth: '320px' }} style={styles.card}>
              <CardContent>
                <Typography variant="h5">Recuperar contraseña</Typography>
                <ForgetForm></ForgetForm>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ResetPassword;
