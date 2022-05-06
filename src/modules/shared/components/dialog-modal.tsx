import { Box, Button, Grid, Modal, Typography } from '@mui/material';
import React, { FunctionComponent } from 'react';

/* ––
 * –––– Props declaration
 * –––––––––––––––––––––––––––––––––– */
export interface DialogModalProps {
  title: string;
  description: string;
  description2: string;
  image: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/* ––
 * –––– Component declaration
 * –––––––––––––––––––––––––––––––––– */
const DialogModal: FunctionComponent<DialogModalProps> = ({
  title,
  description,
  description2,
  image,
  open,
  setOpen,
}) => {
  const handleClose = () => setOpen(false);
  /* –– Render setup
   * –––––––––––––––––––––––––––––––––– */
  const styles = {
    image: {
      background: 'white',
    },
    modalContainer: {
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '30%',
      color: 'white',
      background: '#121721',
      padding: '36px 16px',
      maxWidth: '448px',
      minWidth: '320px',
      borderRadius: '10px',
    },
    modalContent: {
      width: 'auto',
      padding: 32,
    },
  };

  /* –– Render
   * –––––––––––––––––––––––––––––––––– */
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={styles.modalContainer}>
        <Grid container direction="column" justifyContent="center" alignItems="center">
          <Grid item xs="auto">
            <img src={image} width={167} height={146} style={{ objectFit: 'cover' }} />
          </Grid>
          <Grid item xs="auto" pt={2}>
            <Typography id="modal-modal-title" textAlign="center" variant="h5" component="h5">
              {title}
            </Typography>
          </Grid>
          <Grid item xs="auto" pt={2}>
            <Typography variant="body1" align="center">
              {description}
            </Typography>
          </Grid>
          <Grid item xs="auto" pt={2}>
            <Typography variant="body1" align="center" id="modal-modal-description" sx={{ mt: 2 }}>
              {description2}
            </Typography>
          </Grid>
          <Grid item xs="auto" pt={2}>
            <Button variant="contained" color="primary" onClick={handleClose}>
              OK
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

/* ––
 * –––– Export declaration
 * –––––––––––––––––––––––––––––––––– */
export default DialogModal;
