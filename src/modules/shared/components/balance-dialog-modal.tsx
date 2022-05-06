import { Box, Button, Grid, Modal, Typography } from '@mui/material';
import React, { FunctionComponent, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

/* ––
 * –––– Props declaration
 * –––––––––––––––––––––––––––––––––– */
export interface BalanceDialogModalProps {
  title: string;
  description: string;
  description2: string;
  image: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenCreateModal: React.Dispatch<React.SetStateAction<boolean>>;
}

/* ––
 * –––– Component declaration
 * –––––––––––––––––––––––––––––––––– */
const BalanceDialogModal: FunctionComponent<BalanceDialogModalProps> = ({
  title,
  description,
  description2,
  image,
  open,
  setOpen,
  setOpenCreateModal,
}) => {
  const handleClose = () => {
    setOpen(false);
    setOpenCreateModal(true);
  };
  /* –– Render setup
   * –––––––––––––––––––––––––––––––––– */
  const history = useHistory();

  const goToWallet = useCallback(() => history.replace('../../wallet'), []);

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
    popoverFooter: {
      display: 'flex',
      justifyContent: 'space-around',
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

          <Box style={styles.popoverFooter}>
            <Button
              style={{ marginRight: '40px', width: '100px' }}
              variant="outlined"
              color="primary"
              onClick={handleClose}
            >
              OK
            </Button>
            <Button variant="contained" onClick={goToWallet}>
              Cargar billetera
            </Button>
          </Box>
        </Grid>
      </Box>
    </Modal>
  );
};

/* ––
 * –––– Export declaration
 * –––––––––––––––––––––––––––––––––– */
export default BalanceDialogModal;
