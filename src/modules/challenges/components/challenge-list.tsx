import { AuthContext, AuthStatus } from '@context/auth.context';
import { Button, Grid, Typography } from '@mui/material';
import { db } from '@service';
import { User as FirebaseUser, User } from 'firebase/auth';
import { collection, DocumentData, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useParams } from 'react-router-dom';

import ListItem from './list-item';

/* ––
 * –––– Component declaration
 * –––––––––––––––––––––––––––––––––– */
const ChallengeList: FunctionComponent = () => {
  /* –– Render setup
   * –––––––––––––––––––––––––––––––––– */
  const { challengeId } = useParams<{ challengeId: string }>();
  const gameRef = collection(db, 'Game');
  const queryOrder = query(gameRef, orderBy('Order', 'asc'));
  const [gameData, gameLoading, gameError] = useCollection(queryOrder, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  const challengeRef = collection(db, 'Challenge');
  const queryOrderByCreatedDate = query(challengeRef, orderBy('created', 'desc'));

  const [challengeData, challengeLoading, challengeError] = useCollection(queryOrderByCreatedDate, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  const [categoriesGames, setCategoriesGames] = useState([]);
  const [games, setGames] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const authContext = useContext(AuthContext);
  const [category, setCategory] = useState('MIS RETOS');
  const [user, setUser] = useState<User>();
  const [userData, setUserData] = React.useState<DocumentData>();

  useEffect(() => {
    getUser();
  }, [authContext]);

  useEffect(() => {
    getUserInfo();
  }, [user]);

  const getUser = () => {
    if (authContext.authStatus === AuthStatus.SignedIn) {
      const user = authContext.getSession() as FirebaseUser;
      setUser(user);
    }
  };

  const getUserInfo = async () => {
    const q = query(collection(db, 'User'), where('id', '==', user.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setUserData(doc.data());
    });
  };

  useEffect(() => {
    if (!!gameData && !gameError) {
      const games = gameData.docs.reduce(
        (category: { [key: string]: { [key: string]: string }[] }, game) => {
          category[game.data().Category] = [...(category[game.data().Category] || []), game.data()];
          return category;
        },
        {}
      );
      setGames(gameData.docs);
      setCategoriesGames(Object.keys(games));
    } else {
      //console.log('error');
    }
  }, [gameData, gameError]);

  useEffect(() => {
    if (!!challengeData && !challengeError) {
      setChallenges(challengeData.docs);
      if (typeof challengeId === 'undefined') {
        myChallenge();
      } else {
        filterByChallengeId();
      }
    } else {
      //console.log('error');
    }
  }, [challengeData, challengeError]);

  const filterChallenge = (categoryGame: string) => {
    const updateChallenges = challengeData.docs.filter((curChallenge) => {
      return curChallenge.data().category === categoryGame;
    });
    setCategory(categoryGame);
    setChallenges(updateChallenges);
  };

  const myChallenge = () => {
    if (user && userData) {
      const updateChallenges = challengeData.docs.filter((curChallenge) => {
        return (
          curChallenge.data().createdByUserId === user.uid ||
          (!!curChallenge.data().acceptedByUsername &&
            curChallenge.data().acceptedByUsername === userData.username)
        );
      });
      setCategory('MIS RETOS');
      setChallenges(updateChallenges);
    }
  };

  const filterByChallengeId = () => {
    const updateChallenges = challengeData.docs.filter((curChallenge) => {
      return curChallenge.id === challengeId;
    });
    setCategory('TODOS');
    setChallenges(updateChallenges);
  };

  const styles = {
    inactiveButton: {
      color: 'white',
    },
    activeButton: {
      color: 'primary',
    },
  };

  /* –– Render
   * –––––––––––––––––––––––––––––––––– */
  return challenges && !challengeError && !!games && !gameError && !!categoriesGames ? (
    <>
      <Grid container spacing={2} direction="row" justifyContent="center" alignItems="center">
        <Grid
          pl={12}
          pr={11}
          mt={2}
          mb={2}
          direction="row"
          alignItems="center"
          container
          spacing={2}
          maxWidth={1600}
          minWidth={470}
        >
          <Grid item>
            <Button
              variant="text"
              onClick={() => myChallenge()}
              sx={category == 'MIS RETOS' ? styles.activeButton : styles.inactiveButton}
            >
              MIS RETOS
            </Button>
          </Grid>
          <Grid item>
            <Typography variant="h5" color="white">
              {' '}
              |{' '}
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="text"
              onClick={() => {
                setCategory('TODOS');
                setChallenges(challengeData.docs);
              }}
              sx={category == 'TODOS' ? styles.activeButton : styles.inactiveButton}
            >
              TODOS
            </Button>
          </Grid>
          {categoriesGames.map((categoryName, i) => (
            <Grid item key={i}>
              <Button
                variant="text"
                onClick={() => filterChallenge(categoryName)}
                sx={category == categoryName ? styles.activeButton : styles.inactiveButton}
              >
                {categoryName}
              </Button>
            </Grid>
          ))}
        </Grid>
        <Grid minWidth={470} maxWidth={1600} pl={12} pr={11} mt={2} mb={2} container spacing={2}>
          {challenges.map((challenge, i) =>
            'EXPIRED' != challenge.data().status ? (
              <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                <ListItem
                  version={challenge.data().version}
                  image={challenge.data().image}
                  title={challenge.data().name}
                  id={challenge.id}
                  dates={[challenge.data().date1, challenge.data().date2, challenge.data().date3]}
                  createdBy={challenge.data().createdByUsername}
                  platform={challenge.data().platform}
                  betAmount={challenge.data().betAmount}
                  totalPrize={challenge.data().betAmount * 2 - challenge.data().platformAmount * 2}
                  status={challenge.data().status}
                  createdByUserName={
                    challenge.data().createdByUsername ? challenge.data().createdByUsername : ''
                  }
                  createdByUserId={challenge.data().createdByUserId}
                  acceptedByUserName={
                    challenge.data().acceptedByUsername ? challenge.data().acceptedByUsername : ''
                  }
                  dateAccepted={challenge.data().dateAccepted}
                  challengeScoreOwner={
                    challenge.data().scoreOwner ? challenge.data().scoreOwner : ''
                  }
                  challengeScoreChallenger={
                    challenge.data().scoreChallenger ? challenge.data().scoreChallenger : ''
                  }
                  category={challenge.data().category}
                  gameName={
                    challenge.data().gameName ? challenge.data().gameName : challenge.data().name
                  }
                  contact={challenge.data().contact ? challenge.data().contact : ''}
                ></ListItem>
              </Grid>
            ) : (
              <></>
            )
          )}
        </Grid>
      </Grid>
    </>
  ) : (
    <></>
  );
};

export default ChallengeList;
