/* eslint-disable max-lines */
import { AuthContext, AuthStatus } from '@context/auth.context';
import { yupResolver } from '@hookform/resolvers/yup';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Radio,
  RadioGroup,
  styled,
  Typography,
} from '@mui/material';
import { DialogModalInfo } from '@playfast/app/shared/components/game-popper';
import errorImage from '@playfast/assets/images/confirmation.png';
import reportDrawImage from '@playfast/assets/images/draw-report.png';
import reportLooserImage from '@playfast/assets/images/looser-report.png';
import reportImage from '@playfast/assets/images/report-score.png';
import reportWinnerImage from '@playfast/assets/images/report-winner.png';
import reportReviewImage from '@playfast/assets/images/review-report.png';
import { db, storage } from '@service';
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
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { FunctionComponent, useContext, useEffect } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';

export interface ScoreFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setDialogModalInfo: React.Dispatch<React.SetStateAction<DialogModalInfo>>;
  options: string[];
  challengeScoreOwner: string;
  challengeScoreChallenger: string;
  challengeId: string;
  title: string;
}

export enum ScoreStatus {
  REPORT = 'REPORT',
  WINNER = 'WINNER',
  LOOSER = 'LOOSER',
  DRAW = 'DRAW',
  REVIEW = 'REVIEW',
}

type ChallengeUpdate = {
  scoreOwner?: string;
  scoreChallenger?: string;
  ownerAttachment1?: string;
  ownerAttachment2?: string;
  challengerAttachment1?: string;
  challengerAttachment2?: string;
};
/* ––
 * –––– Component declaration
 * –––––––––––––––––––––––––––––––––– */
export const ScoreForm: FunctionComponent<ScoreFormProps> = ({
  setOpen,
  setOpenDialog,
  setDialogModalInfo,
  options,
  challengeScoreOwner,
  challengeScoreChallenger,
  challengeId,
  title,
}) => {
  /* –– Render setup
   * –––––––––––––––––––––––––––––––––– */
  const [challengeWinner, setChallengeWinner] = useState('');
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChallengeWinner(event.target.value);
  };
  const [uploadingFile, setUploadingFile] = useState(false);

  const [fileUserInMatch, setFileUserInMatch] = useState(null);
  const [urlUserInMatch, setUrlUserInMatch] = useState('');
  const [fileScoreInMatch, setFileScoreInMatch] = useState(null);
  const [urlScoreInMatch, setUrlScoreInMatch] = useState('');

  const [nameUserInMatch, setNameUserInMatch] = useState('');
  const [nameScoreInMatch, setNameScoreInMatch] = useState('');

  const error = fileUserInMatch === null || fileScoreInMatch === null;

  /*const handleChangeFileOne = (e: any) => {
    if (e.target.files[0]) {
      setTimeout(() => {
        setFileUserInMatch(e.target.files[0]);
      }, 100);
    }
  };*/

  const handleChangeFileOne = useCallback((e: any) => {
    if (e.target.files[0]) {
      setFileUserInMatch(e.target.files[0]);
      setNameUserInMatch(e.target.files[0].name);
    }
  }, []);

  /*const handleChangeFileTwo = (e: any) => {
    if (e.target.files[0]) {
      setFileScoreInMatch(e.target.files[0]);
    }
  };*/

  const handleChangeFileTwo = useCallback((e: any) => {
    if (e.target.files[0]) {
      setFileScoreInMatch(e.target.files[0]);
      setNameScoreInMatch(e.target.files[0].name);
    }
  }, []);

  const handleUploadFileOne = (data: { [key: string]: string }) => {
    const storageRef = ref(storage, 'challenge_screenshots/' + fileUserInMatch.name);
    const uploadTask = uploadBytesResumable(storageRef, fileUserInMatch);
    // Listen for state changes, errors, and completion of the upload.
    setUploadingFile(true);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;
          // ...
          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
        setUploadingFile(false);
        showErrorMsg();
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          setUrlUserInMatch(downloadURL);
        });
        handleUploadFileTwo(data);
      }
    );
  };

  const handleUploadFileTwo = (data: { [key: string]: string }) => {
    const storageRef = ref(storage, 'challenge_screenshots/' + fileScoreInMatch.name);
    const uploadTask = uploadBytesResumable(storageRef, fileScoreInMatch);
    // Listen for state changes, errors, and completion of the upload.
    setUploadingFile(true);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;
          // ...
          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
        setUploadingFile(false);
        showErrorMsg();
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          setUrlScoreInMatch(downloadURL);
          setTimeout(() => {
            setChallengeUpdate(data as unknown as ChallengeUpdate);
            setUploadingFile(false);
          }, 500);
        });
      }
    );
  };

  const styles = {
    informationBox: {
      background: '#FFFFFF17',
      display: 'flex',
      alignItems: 'center',
      padding: '4px 16px',
      borderRadius: '10px',
      color: '#FFFFFF8F',
    },
    dateTimePicker: {
      svg: '#5ACBB7',
    },
    root: {
      '& .MuiPaper-root': {
        backgroundColor: '#121721',
      },
    },
    dolarAdorment: {
      color: 'white',
    },
    infoOutlinedIcon: {
      marginRight: '12px',
    },
    formControl: {
      '& .MuiOutlinedInput-root': {
        border: '1px solid rgba(255, 255, 255, 0.23)',
      },
      '& .MuiOutlinedInput-root: hover': {
        border: 'none',
      },
      '& .MuiOutlinedInput-root.Mui-error': {
        border: 'none',
      },
      svg: { color: '#5ACBB7' },
    },
    checkbox: {
      color: 'white',
      '&.Mui-checked': {
        color: 'white',
      },
      //padding: '1px',
    },
    helperText: {
      '&.MuiFormHelperText-root.Mui-required': {
        color: '#121721',
      },
      '&.MuiFormHelperText-root.Mui-error': {
        color: '#d32f2f',
      },
    },
  };
  const validationSchema = Yup.object().shape({
    winner: Yup.string().required('Faltan datos por ingresar, por favor verifica la información'),
  });

  const handleClose = () => setOpen(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'all',
    defaultValues: {
      winner: '',
    },
  });

  const history = useHistory();
  const authContext = useContext(AuthContext);
  const [challengeUpdate, setChallengeUpdate] = useState<ChallengeUpdate>();
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
    updateChallengeData();
  }, [authContext, challengeUpdate]);

  useEffect(() => {
    getUser();
  }, [authContext]);

  const Input = styled('input')({
    marginTop: '16px',
  });

  const updateChallengeData = async () => {
    if (authContext.authStatus === AuthStatus.SignedIn) {
      if (challengeUpdate && challengeWinner !== '') {
        try {
          if (userData.username === options[0]) {
            updateChallenge({
              scoreOwner: challengeWinner,
              ownerAttachment1: urlUserInMatch,
              ownerAttachment2: urlScoreInMatch,
            });
          } else {
            updateChallenge({
              scoreChallenger: challengeWinner,
              challengerAttachment1: urlUserInMatch,
              challengerAttachment2: urlScoreInMatch,
            });
          }
          setChallengeUpdate(null);
        } catch (error) {
          showErrorMsg();
        }
      }
    } else {
      redirectToHome();
    }
  };

  const showModalDialog = (scoreStatus: ScoreStatus) => {
    let dialogModalInfo: DialogModalInfo;
    if (scoreStatus === ScoreStatus.DRAW) {
      dialogModalInfo = {
        title: '¡Lograste un empate!',
        image: reportDrawImage,
        description1: `Lograste un empate en el reto ${title} pronto recibiras el monto correspondiente en tu billetera digital.`,
        description2: '¡Lo diste todo!',
      };
    } else if (scoreStatus === ScoreStatus.WINNER) {
      dialogModalInfo = {
        title: '¡Felicidades!',
        image: reportWinnerImage,
        description1: `Eres el ganador del reto ${title}, pronto recibiras el monto del premio en tu billetera digital.`,
        description2: '¡Lo hiciste genial!',
      };
    } else if (scoreStatus === ScoreStatus.LOOSER) {
      dialogModalInfo = {
        title: '¡Gracias por participar!',
        image: reportLooserImage,
        description1: 'Sigue practicando, pronto lo lograrás y te quedarás con el premio.',
        description2: '¡Jugaste increible!',
      };
    } else if (scoreStatus === ScoreStatus.REVIEW) {
      dialogModalInfo = {
        title: '',
        image: reportReviewImage,
        description1:
          'Vamos a validar la información brindada para definir el ganador del reto. Una vez definido te notificaremos.',
        description2: '',
      };
    } else {
      dialogModalInfo = {
        title: '¡Tu marcador fue reportado!',
        image: reportImage,
        description1: 'Estamos a la espera de que tu contrincante ingrese el marcador.',
        description2: 'Una vez que recibamos esta información notificaremos el ganador.',
      };
    }

    setOpen(false);
    setDialogModalInfo(dialogModalInfo);
    setOpenDialog(true);
    setChallengeWinner('');
  };

  const validateWinner = () => {
    let scoreStatus = ScoreStatus.REPORT;
    if (challengeScoreOwner !== '' || challengeScoreChallenger !== '') {
      if (userData.username === options[0] && challengeScoreChallenger !== '') {
        if (challengeWinner === challengeScoreChallenger) {
          if (challengeWinner === 'Empate') {
            scoreStatus = ScoreStatus.DRAW;
          } else if (challengeWinner === userData.username) {
            scoreStatus = ScoreStatus.WINNER;
          } else {
            scoreStatus = ScoreStatus.LOOSER;
          }
        } else {
          scoreStatus = ScoreStatus.REVIEW;
        }
      } else if (challengeScoreOwner !== '') {
        if (challengeWinner === challengeScoreOwner) {
          if (challengeWinner === 'Empate') {
            scoreStatus = ScoreStatus.DRAW;
          } else if (challengeWinner === userData.username) {
            scoreStatus = ScoreStatus.LOOSER;
          } else {
            scoreStatus = ScoreStatus.WINNER;
          }
        } else {
          scoreStatus = ScoreStatus.REVIEW;
        }
      }
      showModalDialog(scoreStatus);
    } else {
      showModalDialog(scoreStatus);
    }
  };

  const updateChallenge = async (challenge: ChallengeUpdate) => {
    const getChallenge = doc(db, 'Challenge', challengeId);
    try {
      await updateDoc(getChallenge, challenge);

      validateWinner();
    } catch (err) {
      showErrorMsg();
    }
  };

  const onSubmit = (data: { [key: string]: string }) => {
    handleUploadFileOne(data);
  };

  const redirectToHome = useCallback(() => history.replace('../../home'), []);

  const showErrorMsg = () => {
    const dialogModalInfo: DialogModalInfo = {
      title: '¡Opps, ha ocurrido un error!',
      image: errorImage,
      description1: 'Por favor intentalo nuevamente',
      description2: '',
    };
    setDialogModalInfo(dialogModalInfo);
    setOpenDialog(true);
  };

  /* –– Render
   * –––––––––––––––––––––––––––––––––– */
  return (
    <>
      <Box mt={4} sx={styles.root}>
        <Grid container direction="column" justifyContent="space-between" alignItems="stretch">
          <form noValidate autoComplete="off">
            <Grid item xs={12} mt={1}>
              <Box height="fit-content" pt={14} style={styles.informationBox}>
                <InfoOutlinedIcon style={styles.infoOutlinedIcon}></InfoOutlinedIcon>
                <Typography maxWidth={494} variant="caption">
                  Para validar el marcador del reto, debés ingresar la siguiente información un
                  máximo de 2.5 horas después de la fecha agenda para el reto. Recordá tener a la
                  mano las imágenes o capturas de pantalla de la partida realizada.
                </Typography>
              </Box>
            </Grid>
            <Grid mt={2} item xs="auto">
              <Typography color="white" variant="body1">
                Seleccioná el jugador que ganó el reto
              </Typography>

              <FormControl
                required
                //error={error}
                component="fieldset"
                sx={{ m: 1 }}
                variant="standard"
              >
                <RadioGroup
                  aria-labelledby="radio-buttons-group-options"
                  name="radio-buttons-group-options"
                >
                  {options.map((element, index) => {
                    return typeof element !== 'undefined' && element !== null ? (
                      <FormControlLabel
                        key={index}
                        sx={styles.checkbox}
                        value={element}
                        control={
                          <Radio
                            {...register('winner')}
                            sx={styles.checkbox}
                            onChange={handleChange}
                            name="winner"
                          />
                        }
                        label={element}
                      />
                    ) : (
                      <></>
                    );
                  })}
                </RadioGroup>
                <FormHelperText sx={styles.helperText}>{errors.winner?.message}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid mt={3} item xs={12}>
              <input
                type="file"
                name="contained-button-file-1"
                id="contained-button-file-1"
                onChange={handleChangeFileOne}
                style={{ display: 'none' }}
              />
              <label htmlFor="contained-button-file-1">
                <Typography mb={1} color="white" variant="body1">
                  Captura de imagen donde se vea el usuario que participó en el evento
                </Typography>
                <Button variant="contained" color="primary" component="span">
                  Seleccionar imagen
                </Button>
              </label>
              <br></br>
              <Typography color="primary" variant="caption">
                {nameUserInMatch}
              </Typography>
            </Grid>
            <Grid mt={2} mb={2} item xs={12}>
              <input
                type="file"
                name="contained-button-file-2"
                id="contained-button-file-2"
                onChange={handleChangeFileTwo}
                style={{ display: 'none' }}
              />
              <label htmlFor="contained-button-file-2">
                <Typography mb={1} color="white" variant="body1">
                  Captura de imagen del marcador final del reto
                </Typography>
                <Button variant="contained" color="primary" component="span">
                  Seleccionar imagen
                </Button>
              </label>
              <br></br>
              <Typography color="primary" variant="caption">
                {nameScoreInMatch}
              </Typography>
            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              spacing={2}
            >
              <Grid item>
                <Button variant="outlined" color="primary" onClick={handleClose}>
                  CANCELAR
                </Button>
              </Grid>
              <Grid item>
                <Button
                  disabled={!isValid || error}
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit(onSubmit)}
                >
                  REPORTAR
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Box>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={uploadingFile}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};
export default ScoreForm;
