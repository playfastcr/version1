import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Container, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Footer } from '@playfast/app/shared/components/footer';
import ResponsiveAppBar from '@playfast/app/shared/components/responsive-appbar';
import WalletInformation from '@playfast/app/wallet/components/wallet-information';
import React from 'react';
import { useHistory } from 'react-router-dom';

const styles = {
  container: {
    display: 'flex',
    minHeight: '70vh',
    flexDirection: 'column',
    backgroundColor: '#171C27',
    flex: 1,
    height: '100%',
  },
  link: {
    textDecoration: 'none',
    color: 'white',
    textTransform: 'none',
  },
};

export const WalletView = () => {
  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };
  return (
    <>
      <ResponsiveAppBar></ResponsiveAppBar>
      <Container maxWidth={false} sx={styles.container}>
        <Box mt={6} width={100} px={10}>
          <Button variant="text" onClick={goBack} sx={styles.link}>
            <ArrowBackIcon></ArrowBackIcon> Volver
          </Button>
        </Box>
        <Typography variant="h3" color="primary" px={10} py={5}>
          Billetera digital
        </Typography>
        <WalletInformation></WalletInformation>
      </Container>
      <Footer></Footer>
    </>
  );
};

export default WalletView;
