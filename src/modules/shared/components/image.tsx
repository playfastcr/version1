import { Box, Typography } from '@mui/material';
import React, { FunctionComponent } from 'react';

import GamePopper from './game-popper';

/* ––
 * –––– Props declaration
 * –––––––––––––––––––––––––––––––––– */
export interface ImageProps {
  title: string;
  image: string;
  index: number;
  category: string;
  gameId: string;
}

/* ––
 * –––– Component declaration
 * –––––––––––––––––––––––––––––––––– */
const Image: FunctionComponent<ImageProps> = ({ title, image, index, category, gameId }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);
  /* –– Render setup
   * –––––––––––––––––––––––––––––––––– */
  const styles = {
    container: {
      width: 'inherit',
      maxHeight: '185px',
      borderRadius: '10px',
      cursor: 'pointer',
    },
    image: {
      position: 'relative',
      width: 'inherit',
      borderRadius: '10px',
      aspectRatio: '16 / 9',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      height: '-webkit-fill-available',
      backgroundPosition: 'center',
    },
    popoverContainer: {
      background: '#121721',
    },
    popoverImage: {
      background: 'white',
      objetFit: 'cover',
    },
    popoverFooter: {
      display: 'flex',
      justifyContent: 'space-around',
    },
    titleBox: {
      position: 'absolute',
      bottom: '0px',
    },
  };
  /* –– Render
   * –––––––––––––––––––––––––––––––––– */
  return (
    <>
      <Box
        style={styles.container}
        aria-owns={open ? 'mouse-over-popover-' + index : undefined}
        aria-haspopup="true"
        onClick={handlePopoverOpen}
      >
        <Box
          sx={styles.image}
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(18, 23, 33, 0) 0%, #121721 100%),
                  url('${image}')`,
          }}
          width="100%"
        >
          <Box m="8px 16px" sx={styles.titleBox}>
            <Typography variant="body1" color="white">
              {title}
            </Typography>
          </Box>
        </Box>
      </Box>
      <GamePopper
        title={title}
        image={image}
        index={index}
        open={open}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        category={category}
        gameId={gameId}
      ></GamePopper>
    </>
  );
};

/* ––
 * –––– Export declaration
 * –––––––––––––––––––––––––––––––––– */
export default Image;
