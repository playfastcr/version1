/* eslint-disable max-lines */
import { AuthContext, AuthStatus } from '@context/auth.context';
import CloseIcon from '@mui/icons-material/Close';
import ShareIcon from '@mui/icons-material/Share';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Radio,
  RadioGroup,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import ChallengeModal from '@playfast/app/shared/components/challenge-modal';
import DialogModal from '@playfast/app/shared/components/dialog-modal';
import { DialogModalInfo, initialDialogInfo } from '@playfast/app/shared/components/game-popper';
import confirmationImage from '@playfast/assets/images/confirmation.png';
import errorImage from '@playfast/assets/images/confirmation.png';
import { db } from '@service';
import { User as FirebaseUser, User } from 'firebase/auth';
import {
  collection,
  doc,
  DocumentData,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import moment from 'moment-timezone';
import React, { FunctionComponent, useContext, useEffect, useState } from 'react';

import ScoreModal from './score-modal';

/* ––
 * –––– Props declaration
 * –––––––––––––––––––––––––––––––––– */
export interface ListItemProps {
  platform: string;
  version: string;
  title: string;
  image: string;
  id: string;
  dates: any[];
  createdBy: string;
  totalPrize: number;
  betAmount: number;
  status: string;
  createdByUserId: string;
  createdByUserName: string;
  acceptedByUserName: string;
  dateAccepted: any;
  challengeScoreOwner: string;
  challengeScoreChallenger: string;
  category: string;
  contact: string;
  gameName: string;
}

export enum ChallengeStatus {
  INPROGRESS = 'INPROGRESS',
  WAITING = 'WAITING',
  EXPIRED = 'EXPIRED',
  DONE = 'DONE',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

/* ––
 * –––– Component declaration
 * –––––––––––––––––––––––––––––––––– */
const ListItem: FunctionComponent<ListItemProps> = ({
  platform,
  version,
  title,
  image,
  createdBy,
  dates,
  totalPrize,
  betAmount,
  id,
  status,
  createdByUserId,
  createdByUserName,
  acceptedByUserName,
  dateAccepted,
  challengeScoreOwner,
  challengeScoreChallenger,
  category,
  contact,
  gameName,
}) => {
  /* –– Render setup
   * –––––––––––––––––––––––––––––––––– */
  const authContext = useContext(AuthContext);
  const [user, setUser] = useState<User>();
  const [challengeDate, setChallengeDate] = useState('');
  const [openDialogModal, setOpenDialogModal] = React.useState(false);
  const [dialogModalInfo, setDialogModalInfo] = useState<DialogModalInfo>(initialDialogInfo);
  const [openScoreModal, setOpenScoreModal] = React.useState(false);
  const [openMatchAgainModal, setOpenMatchAgainModal] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [openTooltip, setOpenTooltip] = React.useState(false);

  const handleTooltipClose = () => {
    setOpenTooltip(false);
  };

  const handleTooltipOpen = () => {
    setOpenTooltip(true);
  };

  useEffect(() => {
    getUser();
  }, [authContext]);

  useEffect(() => {
    getUserInfo();
  }, [user]);

  const setInBalance = async (status: boolean) => {
    const q = query(collection(db, 'User'), where('id', '==', user.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      updateDoc(doc.ref, { inBalance: status });
    });
  };

  const getUser = () => {
    if (authContext.authStatus === AuthStatus.SignedIn) {
      const user = authContext.getSession() as FirebaseUser;
      setUser(user);
    }
  };

  const [userData, setUserData] = React.useState<DocumentData>();

  const getUserInfo = async () => {
    const q = query(collection(db, 'User'), where('id', '==', user.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setUserData(doc.data());
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChallengeDate(event.target.value);
  };
  const error = challengeDate === '';

  const handleClick = async (challengeId: string) => {
    if (!error) {
      const getChallenge = doc(db, 'Challenge', challengeId);
      if (
        typeof userData.availableBalance !== 'undefined' &&
        userData.availableBalance !== null &&
        userData.availableBalance >= betAmount
      ) {
        try {
          await updateDoc(getChallenge, {
            status: 'INPROGRESS',
            acceptedByUserEmail: user.email,
            acceptedByUsername: userData.username,
            dateAccepted: moment(challengeDate, 'DD/MM/YYYY | hh:mm a').toDate(),
          });
          setInBalance(true);
          const dialogModalInfo: DialogModalInfo = {
            title: '¡Felicidades!',
            image: confirmationImage,
            description1:
              'Ya confirmaste el reto, recuerda la fecha y la hora. Playfast cobrará una comisión del 10% sobre el monto total del reto',
            description2: '¡Mucha Suerte!',
          };
          setDialogModalInfo(dialogModalInfo);
          setOpenDialogModal(true);
        } catch (err) {
          const dialogModalInfo: DialogModalInfo = {
            title: '¡Opps, ha ocurrido un error!',
            image: errorImage,
            description1: 'Por favor intentalo nuevamente',
            description2: '',
          };
          setDialogModalInfo(dialogModalInfo);
          setOpenDialogModal(true);
        }
      } else {
        const dialogModalInfo: DialogModalInfo = {
          title: '¡Opps, ha ocurrido un error!',
          image: errorImage,
          description1: 'No tienes suficiente saldo disponible',
          description2: '',
        };
        setDialogModalInfo(dialogModalInfo);
        setOpenDialogModal(true);
      }
    }
  };

  const handleSnackClick = (id: string) => {
    navigator.clipboard.writeText(
      `${import.meta.env.VITE_API_BASE_URL}` + '/challenges/challenge/' + id
    );
    setOpen(true);
  };

  const handleSnackClose = () => {
    setOpen(false);
  };

  const action = (
    <>
      <CloseIcon onClick={handleSnackClose} fontSize="small" />
    </>
  );

  const styles = {
    container: {
      width: 'inherit',
      maxHeight: '475px',
      minHeight: '475px',
      position: 'relative',
      borderRadius: '10px',
      background: '#121721',
    },
    image: {
      width: 'inherit',
      maxWidth: 'inherit',
      maxHeight: '185px',
      height: '185px',
      borderRadius: '10px 10px 0 0',
    },
    checkbox: {
      color: 'white',
      '&.Mui-checked': {
        color: 'white',
      },
      padding: '1px',
      '&.MuiFormControlLabel-root .MuiTypography-root': {
        fontSize: '14px',
      },
    },
    helperText: {
      '&.MuiFormHelperText-root.Mui-required': {
        color: '#121721',
      },
      '&.MuiFormHelperText-root.Mui-error': {
        color: '#d32f2f',
      },
    },
    prizeBox: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      position: 'absolute',
      width: '100%',
      height: '65px',
      color: 'white',
      background:
        'linear-gradient(270deg, #000000 53.12%, rgba(0, 0, 0, 0.627737) 75.52%, rgba(0, 0, 0, 0) 100%)',
    },
    totalPrize: {
      position: 'absolute',
      height: '36px',
      left: '229px',
      top: '4px',
    },
    totalPrizeText: {
      position: 'absolute',
      height: '23px',
      left: '104px',
      top: '15px',
    },
    betAmountText: {
      position: 'absolute',
      height: '20px',
      left: '119px',
      top: '36px',
    },
    chip: {
      color: 'white',
      borderColor: 'white',
    },
    chipExpired: {
      background: '#364A6E;',
      color: 'white',
    },
    chipContainer: {
      position: 'absolute',
    },
    snackbar: {
      backgroundColor: 'rgba(255, 255, 255, 0.09)',
      boxShadow:
        '0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px rgba(0, 0, 0, 0.14), 0px 1px 18px rgba(0, 0, 0, 0.12)',
      borderRadius: '4px',
    },
  };

  const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      color: 'white!important',
      border: '1px solid #5ACBB7!important',
      boxSizing: 'border-box!important',
      borderRadius: '4px!important',
      backgroundColor: '#364A6E!important',
    },
  }));
  /* –– Render
   * –––––––––––––––––––––––––––––––––– */
  return user && userData ? (
    <>
      <Box sx={styles.container}>
        <Grid container direction="column" justifyContent="center" alignItems="center">
          <Grid position="relative" container direction="column">
            <Box pt={1} mt={1} sx={styles.prizeBox}>
              <Box pr={1}>
                <Typography pt={1} variant="subtitle2">
                  Bolsa de premio
                </Typography>
                <Typography pt={0} color="primary" variant="caption">
                  {`$${betAmount} por jugador`}
                </Typography>
              </Box>
              <Box>
                <Typography pr={2} variant="h5">{`$${totalPrize}`}</Typography>
              </Box>
            </Box>
            <img src={image} style={styles.image} />
          </Grid>
        </Grid>
        <Grid container direction="column">
          <Grid item xs="auto" m="0px 16px 0px 16px">
            <Typography variant="h6" mt={2} color="primary">
              {version}
            </Typography>
            <Typography variant="body2" mt={2} color="primary">
              {platform}
            </Typography>
            <Typography variant="caption" mt={2} color="white">
              {`${title} | Creado por: ${createdBy}`}
            </Typography>
            <Typography variant="caption" mt={2} color="white"></Typography>
            {status === ChallengeStatus.INPROGRESS && acceptedByUserName !== '' ? (
              <>
                <br></br>
                <Typography variant="caption" mt={2} color="white">
                  {`Aceptado por: `}
                  <Typography variant="caption" mt={2} color="primary">
                    {acceptedByUserName}
                  </Typography>
                </Typography>
              </>
            ) : (
              <></>
            )}
          </Grid>
          <Grid item xs="auto" m="0px 16px 0px 16px">
            <FormControl
              required
              error={error}
              component="fieldset"
              sx={{ m: 1 }}
              variant="standard"
            >
              <RadioGroup
                aria-labelledby="radio-buttons-group-dates"
                name="radio-buttons-group-dates"
              >
                {dates.map((element, index) => {
                  return typeof element !== 'undefined' &&
                    element !== null &&
                    status === ChallengeStatus.WAITING &&
                    createdByUserId !== user.uid ? (
                    <FormControlLabel
                      key={index}
                      sx={styles.checkbox}
                      value={moment(element.seconds * 1000).format('DD/MM/YYYY | hh:mm a')}
                      control={
                        <Radio sx={styles.checkbox} onChange={handleChange} name={`date${index}`} />
                      }
                      label={moment(element.seconds * 1000).format('DD/MM/YYYY | hh:mm a')}
                    />
                  ) : typeof element !== 'undefined' &&
                    element !== null &&
                    status === ChallengeStatus.INPROGRESS &&
                    typeof dateAccepted !== 'undefined' &&
                    dateAccepted !== null &&
                    moment
                      .tz(
                        moment(dateAccepted.seconds * 1000).format('DD/MM/YYYY | hh:mm a'),
                        'DD/MM/YYYY | hh:mm a',
                        'America/Costa_Rica'
                      )
                      .isSame(
                        moment.tz(
                          moment(element.seconds * 1000).format('DD/MM/YYYY | hh:mm a'),
                          'DD/MM/YYYY | hh:mm a',
                          'America/Costa_Rica'
                        )
                      ) ? (
                    <FormControlLabel
                      key={index}
                      sx={styles.checkbox}
                      control={
                        <Checkbox
                          sx={styles.checkbox}
                          checked={true}
                          onChange={handleChange}
                          name={`date${index}`}
                          disabled
                        />
                      }
                      label={`${moment(element.seconds * 1000).format('DD/MM/YYYY | hh:mm a')}`}
                    />
                  ) : typeof element !== 'undefined' &&
                    element !== null &&
                    createdByUserId === user.uid &&
                    status === ChallengeStatus.WAITING ? (
                    <Typography variant="subtitle2" mt={2} color="primary">
                      {moment(element.seconds * 1000).format('DD/MM/YYYY | hh:mm a')}
                    </Typography>
                  ) : (
                    <></>
                  );
                })}
              </RadioGroup>
              <FormHelperText sx={styles.helperText}>
                {status === ChallengeStatus.WAITING && createdByUserId !== user.uid
                  ? 'Debes elegir una fecha'
                  : ''}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
        {status === ChallengeStatus.WAITING ? (
          <Grid
            bottom={24}
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={styles.chipContainer}
          >
            {status === ChallengeStatus.WAITING && createdByUserId !== user.uid ? (
              <Grid item px={3}>
                {(!!userData.inTransaction && userData.inTransaction) ||
                (!!userData.inBalance && userData.inBalance) ? (
                  <>
                    <CustomTooltip
                      title="Tú balance se está actualizando"
                      onClose={handleTooltipClose}
                      open={openTooltip}
                    >
                      <Button
                        variant={'outlined'}
                        color="primary"
                        component="div"
                        onClick={handleTooltipOpen}
                      >
                        ACEPTAR
                      </Button>
                    </CustomTooltip>
                  </>
                ) : (
                  <Button
                    variant={error ? 'outlined' : 'contained'}
                    color="primary"
                    onClick={() => handleClick(id)}
                  >
                    ACEPTAR
                  </Button>
                )}
                <DialogModal
                  title={dialogModalInfo.title}
                  image={dialogModalInfo.image}
                  description={dialogModalInfo.description1}
                  description2={dialogModalInfo.description2}
                  open={openDialogModal}
                  setOpen={setOpenDialogModal}
                ></DialogModal>
              </Grid>
            ) : (
              <></>
            )}
            <Grid item>
              <ShareIcon color="primary" onClick={() => handleSnackClick(id)}></ShareIcon>
              <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleSnackClose}
                message="Link copiado"
                action={action}
              />
            </Grid>
          </Grid>
        ) : status === ChallengeStatus.DONE &&
          ((createdByUserId === user.uid && challengeScoreOwner === '') ||
            (acceptedByUserName === userData.username && challengeScoreChallenger === '')) ? (
          <Grid
            bottom={24}
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={styles.chipContainer}
          >
            <Button variant="contained" color="primary" onClick={() => setOpenScoreModal(true)}>
              REPORTAR MARCADOR
            </Button>
          </Grid>
        ) : (
          <></>
        )}
        {status === ChallengeStatus.INPROGRESS ? (
          <Grid bottom={78} sx={styles.chipContainer} item ml={2}>
            <Chip sx={styles.chip} label="EN PROCESO" variant="outlined" />
          </Grid>
        ) : status === ChallengeStatus.EXPIRED ? (
          <Grid bottom={78} sx={styles.chipContainer} item ml={2}>
            <Chip sx={styles.chip} label="VENCIDO" variant="outlined" />
          </Grid>
        ) : status === ChallengeStatus.CANCELED ? (
          <Grid bottom={78} sx={styles.chipContainer} item ml={2}>
            <Chip sx={styles.chip} label="FINALIZADO" variant="outlined" />
          </Grid>
        ) : status === ChallengeStatus.COMPLETED ||
          (createdByUserId === user.uid && challengeScoreOwner !== '') ||
          (acceptedByUserName === userData.username && challengeScoreChallenger !== '') ? (
          <>
            <Grid bottom={78} sx={styles.chipContainer} item ml={2}>
              <Chip sx={styles.chip} label="COMPLETADO" variant="outlined" />
            </Grid>
            <Grid
              bottom={24}
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              sx={styles.chipContainer}
            >
              <Button
                variant={'outlined'}
                color="primary"
                onClick={() => setOpenMatchAgainModal(true)}
              >
                VOLVER A RETAR
              </Button>
              <ChallengeModal
                title={gameName}
                image={image}
                index={0}
                open={openMatchAgainModal}
                setOpen={setOpenMatchAgainModal}
                category={category}
                gameId={id}
                setDialogModalInfo={setDialogModalInfo}
                setOpenDialog={setOpenDialogModal}
                nameAgainMatch={title ? title : gameName}
                versionAgainMatch={version}
                platformAgarinMatch={platform}
                amountAgainMatch={betAmount}
                contactAgainMatch={contact}
              ></ChallengeModal>
            </Grid>
          </>
        ) : (
          <></>
        )}
        <ScoreModal
          title={title}
          image={image}
          open={openScoreModal}
          setOpen={setOpenScoreModal}
          setDialogModalInfo={setDialogModalInfo}
          setOpenDialog={setOpenDialogModal}
          owner={createdByUserName}
          challenger={acceptedByUserName}
          challengeScoreOwner={challengeScoreOwner}
          challengeScoreChallenger={challengeScoreChallenger}
          challengeId={id}
        ></ScoreModal>
        <DialogModal
          title={dialogModalInfo.title}
          image={dialogModalInfo.image}
          description={dialogModalInfo.description1}
          description2={dialogModalInfo.description2}
          open={openDialogModal}
          setOpen={setOpenDialogModal}
        ></DialogModal>
      </Box>
    </>
  ) : (
    <></>
  );
};

/* ––
 * –––– Export declaration
 * –––––––––––––––––––––––––––––––––– */
export default ListItem;
