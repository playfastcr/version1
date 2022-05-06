import { AuthContext, AuthStatus } from '@context/auth.context';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { Box, Button, ClickAwayListener, Popper, Typography } from '@mui/material';
import EmptyBalance from '@playfast/assets/images/empty-balance-grid.png';
import { db } from '@service';
import { User as FirebaseUser } from 'firebase/auth';
import {
  collection,
  doc,
  DocumentData,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import BalanceDialogModal from './balance-dialog-modal';
import ChallengeModal from './challenge-modal';
import DialogModal from './dialog-modal';

/* ––
 * –––– Props declaration
 * –––––––––––––––––––––––––––––––––– */
export interface GamePopperProps {
  title: string;
  image: string;
  index: number;
  open: boolean;
  anchorEl: HTMLElement;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement>>;
  category: string;
  gameId: string;
}

export interface DialogModalInfo {
  title: string;
  image: string;
  description1: string;
  description2: string;
}

export const initialDialogInfo = {
  title: '',
  image: '',
  description1: '',
  description2: '',
};

/* ––
 * –––– Component declaration
 * –––––––––––––––––––––––––––––––––– */
const GamePopper: FunctionComponent<GamePopperProps> = ({
  title,
  image,
  index,
  open,
  anchorEl,
  setAnchorEl,
  category,
  gameId,
}) => {
  const history = useHistory();
  const authContext = useContext(AuthContext);
  const [openModal, setOpenModal] = React.useState(false);
  const [openDialogModal, setOpenDialogModal] = React.useState(false);
  const [dialogModalInfo, setDialogModalInfo] = useState<DialogModalInfo>(initialDialogInfo);
  const [openModalBalance, setOpenModalBalance] = React.useState(false);
  const [userData, setUserData] = React.useState<DocumentData>();

  const user = authContext.getSession() as FirebaseUser;

  const getUser = async () => {
    const q = query(collection(db, 'User'), where('id', '==', user.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setUserData(doc.data());
    });
  };

  useEffect(() => {
    getUser();
  }, [authContext]);

  const firsTimeCreatingChallenge = localStorage.getItem('firsTimeCreatingChallenge');

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleCreateButton = () => {
    if (authContext.authStatus === AuthStatus.SignedIn) {
      handlePopoverClose();
      if (
        firsTimeCreatingChallenge ||
        (typeof userData.availableBalance !== 'undefined' &&
          userData.availableBalance !== null &&
          userData.availableBalance == 0)
      ) {
        setOpenModal(true);
      } else {
        localStorage.setItem('firsTimeCreatingChallenge', 'true');
        setOpenModalBalance(true);
      }
    } else {
      history.replace('/auth/sign-in');
    }
  };

  const redirectToChallenges = () => {
    if (authContext.authStatus === AuthStatus.SignedIn) {
      history.replace('../../challenges');
    } else {
      history.replace('/auth/sign-in');
    }
  };

  /* –– Render setup
   * –––––––––––––––––––––––––––––––––– */
  const styles = {
    popoverContainer: {
      background: '#121721',
      borderRadius: '10px',
    },
    popoverImage: {
      background: 'white',
    },
    popoverFooter: {
      display: 'flex',
      justifyContent: 'space-around',
    },
    icon: {
      marginRight: '10px',
    },
  };

  /* –– Render
   * –––––––––––––––––––––––––––––––––– */
  return (
    <>
      <Popper id={`mouse-over-popover-${index}`} open={open} anchorEl={anchorEl} placement="auto">
        <ClickAwayListener onClickAway={handlePopoverClose}>
          <Box
            maxWidth={450}
            minHeight={320}
            style={styles.popoverContainer}
            onMouseLeave={handlePopoverClose}
          >
            <Box height={64} display="flex">
              <Typography variant="h6" color="white" margin="16px 24px;" maxWidth={400}>
                {title}
              </Typography>
            </Box>
            <Box height={290} style={styles.popoverImage}>
              <img src={image} width={'100%'} height={290} />
            </Box>
            <Box style={styles.popoverFooter} width={'inherit'} height={64}>
              <Button onClick={handleCreateButton}>
                <AddModeratorIcon style={styles.icon}></AddModeratorIcon>Crea un Reto
              </Button>
              <Button sx={{ color: 'white' }} onClick={redirectToChallenges}>
                <AdminPanelSettingsIcon style={styles.icon}></AdminPanelSettingsIcon>Ver Retos
              </Button>
            </Box>
          </Box>
        </ClickAwayListener>
      </Popper>
      <ChallengeModal
        title={title}
        image={image}
        index={index}
        open={openModal}
        setOpen={setOpenModal}
        category={category}
        gameId={gameId}
        setDialogModalInfo={setDialogModalInfo}
        setOpenDialog={setOpenDialogModal}
      ></ChallengeModal>
      <DialogModal
        title={dialogModalInfo.title}
        image={dialogModalInfo.image}
        description={dialogModalInfo.description1}
        description2={dialogModalInfo.description2}
        open={openDialogModal}
        setOpen={setOpenDialogModal}
      ></DialogModal>
      <BalanceDialogModal
        title=""
        image={EmptyBalance}
        description="Antes de empezar a disfrutar de la experiencia es necesario que tengás saldo suficiente en tu billetera digital para poder participar en los retos."
        description2=""
        open={openModalBalance}
        setOpen={setOpenModalBalance}
        setOpenCreateModal={setOpenModal}
      ></BalanceDialogModal>
    </>
  );
};

/* ––
 * –––– Export declaration
 * –––––––––––––––––––––––––––––––––– */
export default GamePopper;
