import { Box, Container, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { RegisterForm } from '@playfast/app/auth/components/register/register-form';
import Image from '@playfast/assets/images/background.png';
import React, { FunctionComponent } from 'react';

/* ––
 * –––– Component declaration
 * –––––––––––––––––––––––––––––––––– */
const SignUp: FunctionComponent = () => {
  /* –– Render setup
   * –––––––––––––––––––––––––––––––––– */
  const styles = {
    container: {
      backgroundImage: `url(${Image})`,
      flex: 1,
      height: '100%',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      overflow: 'hidden',
    },
    card: {
      backgroundColor: '#171C27',
      margin: '10% 0',
      width: '60%',
      maxWidth: '694px',
      minWidth: '320px',
    },
  };

  /* –– Render
   * –––––––––––––––––––––––––––––––––– */
  return (
    <>
      <Container maxWidth={false} style={styles.container}>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Card style={styles.card}>
            <CardContent>
              <Typography variant="h5">Registro</Typography>
              <RegisterForm></RegisterForm>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
};

export default SignUp;
