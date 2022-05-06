import { Container, Typography } from '@mui/material';
import GameList from '@playfast/app/games/modules/game-list/game-list';
import { Header } from '@playfast/app/home/components/header';
import { Footer } from '@playfast/app/shared/components/footer';
import React from 'react';

const styles = {
  container: {
    minHeight: '70vh',
    backgroundColor: '#171C27',
    flex: 1,
    height: '100%',
  },
};

export const HomeView = () => {
  return (
    <>
      <Header></Header>
      <Container maxWidth={false} sx={styles.container}>
        <Typography variant="h3" color="primary" px={10} py={5}>
          Categorías
        </Typography>
        <GameList></GameList>
      </Container>
      <Footer></Footer>
    </>
  );
};

export default HomeView;
