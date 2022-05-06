import { Box, Modal, Typography } from '@mui/material';
import { DialogModalInfo } from '@playfast/app/shared/components/game-popper';
import React, { FunctionComponent } from 'react';

import ScoreForm from './score-form';

/* ––
 * –––– Props declaration
 * –––––––––––––––––––––––––––––––––– */
export interface ChallengeModalProps {
  title: string;
  image: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setDialogModalInfo: React.Dispatch<React.SetStateAction<DialogModalInfo>>;
  owner: string;
  challenger: string;
  challengeScoreOwner: string;
  challengeScoreChallenger: string;
  challengeId: string;
}

/* ––
 * –––– Component declaration
 * –––––––––––––––––––––––––––––––––– */
const ScoreModal: FunctionComponent<ChallengeModalProps> = ({
  title,
  image,
  open,
  setOpen,
  setOpenDialog,
  setDialogModalInfo,
  owner,
  challenger,
  challengeScoreOwner,
  challengeScoreChallenger,
  challengeId,
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
            Reportá el marcador del reto
          </Typography>
          <Typography color="#5ACBB7" id="modal-modal-title" variant="h6" component="h2">
            {title}
          </Typography>
          <ScoreForm
            setOpen={setOpen}
            setOpenDialog={setOpenDialog}
            setDialogModalInfo={setDialogModalInfo}
            options={[owner, challenger, 'Empate']}
            challengeScoreOwner={challengeScoreOwner}
            challengeScoreChallenger={challengeScoreChallenger}
            challengeId={challengeId}
            title={title}
          ></ScoreForm>
        </Box>
      </Box>
    </Modal>
  );
};

/* ––
 * –––– Export declaration
 * –––––––––––––––––––––––––––––––––– */
export default ScoreModal;
