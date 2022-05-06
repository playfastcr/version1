import { Grid, Typography } from '@mui/material';
import React, { FunctionComponent } from 'react';
/* ––
 * –––– Props declaration
 * –––––––––––––––––––––––––––––––––– */
export interface BannerTitleProps {
  title: string;
  description: string;
  image: string;
}

/* ––
 * –––– Component declaration
 * –––––––––––––––––––––––––––––––––– */
const BannerTitle: FunctionComponent<BannerTitleProps> = ({ title, description, image }) => {
  /* –– Render setup
   * –––––––––––––––––––––––––––––––––– */
  const descriptionElement = description ? description : null;

  const styles = {
    container: {
      backgroundImage: `url(${image})`,
      height: '343px',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      opacity: '10.9',
      backgroundColor: '#3c3c54',
    },
  };
  /* –– Render
   * –––––––––––––––––––––––––––––––––– */
  return (
    <Grid
      style={styles.container}
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Grid item>
        <Typography variant="h3" color="white">
          {title}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="h1" color="white">
          {descriptionElement}
        </Typography>
      </Grid>
    </Grid>
  );
};

/* ––
 * –––– Export declaration
 * –––––––––––––––––––––––––––––––––– */
export default BannerTitle;
