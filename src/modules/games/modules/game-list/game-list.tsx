import { Button, Grid } from '@mui/material';
import Image from '@playfast/app/shared/components/image';
import { db } from '@service';
import { collection, orderBy, query } from 'firebase/firestore';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';

/* ––
 * –––– Component declaration
 * –––––––––––––––––––––––––––––––––– */
const GameList: FunctionComponent = () => {
  /* –– Render setup
   * –––––––––––––––––––––––––––––––––– */
  const gameRef = collection(db, 'Game');
  const q = query(gameRef, orderBy('Order', 'asc'));
  const [gameData, gameLoading, gameError] = useCollection(q, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  const [categoriesGames, setCategoriesGames] = useState([]);
  const [category, setCategory] = useState('TODOS');
  const [games, setGames] = useState([]);

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

  const filterGame = (categoryGame: string) => {
    const updateGames = gameData.docs.filter((curGame) => {
      return curGame.data().Category === categoryGame;
    });
    setGames(updateGames);
    setCategory(categoryGame);
  };

  const styles = {
    inactiveButton: {
      color: 'white',
    },
    activeButton: {
      color: 'primary',
    },
    imageContainer: {
      paddingLeft: '0px',
    },
  };

  /* –– Render
   * –––––––––––––––––––––––––––––––––– */
  return !!games && !gameError && !!categoriesGames ? (
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
              onClick={() => {
                setCategory('TODOS');
                setGames(gameData.docs);
              }}
              sx={category == 'TODOS' ? styles.activeButton : styles.inactiveButton}
            >
              TODOS
            </Button>
          </Grid>
          {categoriesGames.map((categoryItem, i) => (
            <Grid item key={i}>
              <Button
                variant="text"
                onClick={() => filterGame(categoryItem)}
                sx={category == categoryItem ? styles.activeButton : styles.inactiveButton}
              >
                {categoryItem}
              </Button>
            </Grid>
          ))}
        </Grid>
        <Grid minWidth={470} maxWidth={1600} pl={12} pr={11} mt={2} mb={2} container spacing={2}>
          {games.map((game, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Image
                index={index}
                image={game.data().Image}
                title={game.data().Name}
                category={game.data().Category}
                gameId={game.id}
              ></Image>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  ) : (
    <></>
  );
};

export default GameList;
