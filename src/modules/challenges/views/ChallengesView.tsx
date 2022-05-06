import { Container, Typography } from '@mui/material';
import ChallengeList from '@playfast/app/challenges/components/challenge-list';
import { Header } from '@playfast/app/challenges/components/header';
import { Footer } from '@playfast/app/shared/components/footer';
import React from 'react';

const styles = {
  container: {
    display: 'flex',
    minHeight: '70vh',
    flexDirection: 'column',
    backgroundColor: '#171C27',
    flex: 1,
    height: '100%',
  },
};

export const ChallengesView = () => {
  return (
    <>
      <Header></Header>
      <Container maxWidth={false} sx={styles.container}>
        <Typography variant="h3" color="primary" px={10} py={5}>
          Retos
        </Typography>
        <ChallengeList></ChallengeList>
      </Container>
      <Footer></Footer>
    </>
  );
};

export default ChallengesView;
