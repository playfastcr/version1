import { Grid, Typography } from '@mui/material';
import React from 'react';

export const Footer = () => {
  const styles = {
    container: {
      background: '#121721',
      boxshadow:
        '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 1px 5px rgba(0, 0, 0, 0.12)',
    },
  };

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      style={styles.container}
      p={3}
    >
      <Typography variant="overline" color="white">
        PLAYFAST | TODOS LOS DERECHOS RESERVADOS 2022
      </Typography>
    </Grid>
  );
};
