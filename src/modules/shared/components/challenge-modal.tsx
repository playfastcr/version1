import { Box, Modal, Typography } from '@mui/material';
import React, { FunctionComponent } from 'react';

import ChallengeForm from './challenge-form';
import { DialogModalInfo } from './game-popper';

/* ––
 * –––– Props declaration
 * –––––––––––––––––––––––––––––––––– */
export interface ChallengeModalProps {
  title: string;
  image: string;
  index: number;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  category: string;
  gameId: string;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setDialogModalInfo: React.Dispatch<React.SetStateAction<DialogModalInfo>>;
  nameAgainMatch?: string;
  versionAgainMatch?: string;
  platformAgarinMatch?: string;
  amountAgainMatch?: number;
  contactAgainMatch?: string;
}

/* ––
 * –––– Component declaration
 * –––––––––––––––––––––––––––––––––– */
const ChallengeModal: FunctionComponent<ChallengeModalProps> = ({
  title,
  image,
  open,
  setOpen,
  category,
  gameId,
  setOpenDialog,
  setDialogModalInfo,
  nameAgainMatch,
  versionAgainMatch,
  platformAgarinMatch,
  amountAgainMatch,
  contactAgainMatch,
}) => {
  const handleClose = () => setOpen(false);
  /* –– Render setup
   * –––––––––––––––––––––––––––––––––– */
  const styles = {
    image: {
      background: 'white',
    },
    img: {
      objectFit: 'cover',
    },
    modalContainer: {
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: 614,
      minWidth: '320px',
      height: '90%',
      p: 4,
      color: 'white',
      background: '#121721',
      padding: 0,
      overflow: 'scroll',
      overflowX: 'hidden',
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
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styles.modalContainer}>
          <Box>
            <img src={image} width={'100%'} height={170} style={{ objectFit: 'cover' }} />
          </Box>
          <Box style={styles.modalContent}>
            <Typography id="modal-modal-header" variant="h4" component="h2">
              {nameAgainMatch && nameAgainMatch !== '' ? 'Volvé a retar' : 'Creá un nuevo reto'}
            </Typography>
            <Typography color="#5ACBB7" id="modal-modal-title" variant="h6" component="h2">
              {title}
            </Typography>
            <Typography variant="body1" id="modal-modal-description" sx={{ mt: 2 }}>
              {nameAgainMatch && nameAgainMatch !== ''
                ? 'Volvé a retar a un oponente, incluye el monto y las fechas en que se llevará a cabo el evento.'
                : 'Creá el reto de manera pública, incluye el monto y las fechas en que se llevará a cabo el evento.'}
            </Typography>
            <ChallengeForm
              setOpen={setOpen}
              gameImage={image}
              category={category}
              gameId={gameId}
              setOpenDialog={setOpenDialog}
              setDialogModalInfo={setDialogModalInfo}
              gameName={title}
              nameAgainMatch={nameAgainMatch ? nameAgainMatch : ''}
              versionAgainMatch={versionAgainMatch ? versionAgainMatch : ''}
              platformAgarinMatch={platformAgarinMatch ? platformAgarinMatch : ''}
              amountAgainMatch={amountAgainMatch ? amountAgainMatch : 0}
              contactAgainMatch={contactAgainMatch ? contactAgainMatch : ''}
            ></ChallengeForm>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

/* ––
 * –––– Export declaration
 * –––––––––––––––––––––––––––––––––– */
export default ChallengeModal;
