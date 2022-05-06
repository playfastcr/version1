/* eslint-disable max-lines */
import { AuthContext, AuthStatus } from '@context/auth.context';
import { yupResolver } from '@hookform/resolvers/yup';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DateTimePicker from '@mui/lab/DateTimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
  styled,
  TextField,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
} from '@mui/material';
import confirmationImage from '@playfast/assets/images/confirmation.png';
import errorImage from '@playfast/assets/images/confirmation.png';
import { db } from '@service';
import { User as FirebaseUser } from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import React, { FunctionComponent, useContext, useEffect } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';

import { DialogModalInfo } from './game-popper';

export interface ChallengeFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  gameImage: string;
  category: string;
  gameId: string;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setDialogModalInfo: React.Dispatch<React.SetStateAction<DialogModalInfo>>;
  gameName?: string;
  nameAgainMatch?: string;
  versionAgainMatch?: string;
  platformAgarinMatch?: string;
  amountAgainMatch?: number;
  contactAgainMatch?: string;
}

type Challenge = {
  acceptedByUserEmail: string;
  acceptedByUserId: string;
  betAmount: number;
  category: string;
  contact: string;
  created: Date;
  createdBy: string;
  createdByUserId: string;
  createdByUsername: string;
  date1: Date;
  date2?: Date;
  date3?: Date;
  dateChallenge?: string;
  gameId: string;
  image: string;
  name: string;
  platform: string;
  platformAmount: number;
  status: string;
  version: string;
  gameName: string;
  isRematch: boolean;
};

/* ––
 * –––– Component declaration
 * –––––––––––––––––––––––––––––––––– */
export const ChallengeForm: FunctionComponent<ChallengeFormProps> = ({
  setOpen,
  gameImage,
  category,
  gameId,
  setOpenDialog,
  setDialogModalInfo,
  gameName,
  nameAgainMatch,
  versionAgainMatch,
  platformAgarinMatch,
  amountAgainMatch,
  contactAgainMatch,
}) => {
  /* –– Render setup
   * –––––––––––––––––––––––––––––––––– */
  const history = useHistory();
  const authContext = useContext(AuthContext);
  const [challenge, setChallenge] = useState<Challenge>();
  const [dateValue1, setDateValue1] = React.useState<Date | null>(null);
  const [dateValue2, setDateValue2] = React.useState<Date | null>(null);
  const [dateValue3, setDateValue3] = React.useState<Date | null>(null);
  const [userData, setUserData] = React.useState<DocumentData>();
  const [isRematch, setIsRematch] = React.useState(false);
  const [openTooltip, setOpenTooltip] = React.useState(false);

  const handleTooltipClose = () => {
    setOpenTooltip(false);
  };

  const handleTooltipOpen = () => {
    setOpenTooltip(true);
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
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Faltan datos por ingresar, por favor verifica la información')
      .min(2, 'Debe tener al menos 2 caractéres')
      .max(20, 'Debe tener un máximo de 20 caractéres'),
    version: Yup.string()
      .required('Faltan datos por ingresar, por favor verifica la información')
      .min(2, 'Debe tener al menos 2 caractéres')
      .max(15, 'Debe tener un máximo de 15 caractéres'),
    platform: Yup.string()
      .required('Faltan datos por ingresar, por favor verifica la información')
      .min(2, 'Debe tener al menos 2 caractéres')
      .max(15, 'Debe tener un máximo de 15 caractéres'),
    betAmount: Yup.number()
      .required('Faltan datos por ingresar, por favor verifica la información')
      .typeError('Debes especificar un número')
      .min(1, 'El valor mínimo es 1.'),
    contact: Yup.string()
      .required('Faltan datos por ingresar, por favor verifica la información')
      .min(8, 'Debe tener al menos 8 caractéres')
      .max(50, 'Debe tener un máximo de 50 caractéres'),
    date1: Yup.date()
      .typeError('Debe ingresar una fecha válida. (mm/dd/yyyy hh:mm am or pm)')
      .nullable()
      .required('Faltan datos por ingresar, por favor verifica la información.'),
    date2: Yup.date()
      .nullable()
      .transform((curr, orig) => (orig === '' ? null : curr))
      .typeError('Debe ingresar una fecha válida. (mm/dd/yyyy hh:mm am or pm)'),
    date3: Yup.date()
      .nullable()
      .transform((curr, orig) => (orig === '' ? null : curr))
      .typeError('Debe ingresar una fecha válida. (mm/dd/yyyy hh:mm am or pm)'),
  });

  const handleClose = () => setOpen(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      name: nameAgainMatch,
      version: versionAgainMatch,
      platform: platformAgarinMatch,
      betAmount: amountAgainMatch,
      contact: contactAgainMatch,
      date1: dateValue1,
      date2: dateValue2,
      date3: dateValue3,
    },
  });

  const user = authContext.getSession() as FirebaseUser;

  const getUser = async () => {
    const q = query(collection(db, 'User'), where('id', '==', user.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setUserData(doc.data());
    });
  };

  useEffect(() => {
    createChallengeData();
  }, [authContext, challenge]);

  useEffect(() => {
    getUser();
    if (nameAgainMatch !== '') setIsRematch(true);
  }, [authContext]);

  const setInBalance = async (status: boolean) => {
    const q = query(collection(db, 'User'), where('id', '==', user.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      updateDoc(doc.ref, { inBalance: status });
    });
  };

  const createChallengeData = async () => {
    if (authContext.authStatus === AuthStatus.SignedIn) {
      if (challenge) {
        if (
          typeof userData.availableBalance !== 'undefined' &&
          userData.availableBalance !== null &&
          userData.availableBalance >= challenge.betAmount
        ) {
          try {
            createChallenge({
              acceptedByUserEmail: '',
              acceptedByUserId: '',
              betAmount: challenge.betAmount,
              category: category,
              contact: challenge.contact,
              createdBy: user.email,
              createdByUserId: user.uid,
              created: new Date(),
              createdByUsername: userData.username,
              date1: challenge.date1,
              date2: challenge.date2,
              date3: challenge.date3,
              dateChallenge: '',
              gameId: gameId,
              image: gameImage,
              name: challenge.name,
              platform: challenge.platform,
              platformAmount: challenge.betAmount * 0.1,
              status: 'WAITING',
              version: challenge.version,
              gameName: gameName,
              isRematch: isRematch,
            });
            setInBalance(true);

            setChallenge(null);
            const dialogModalInfo: DialogModalInfo = {
              title: '¡Felicidades!',
              image: confirmationImage,
              description1: 'El reto fue creado con éxito.',
              description2: '¡Mucha Suerte!',
            };
            setOpen(false);
            setDialogModalInfo(dialogModalInfo);
            setOpenDialog(true);
          } catch (error) {
            const dialogModalInfo: DialogModalInfo = {
              title: '¡Opps, ha ocurrido un error!',
              image: errorImage,
              description1: 'Por favor intentalo nuevamente',
              description2: '',
            };
            setDialogModalInfo(dialogModalInfo);
            setOpenDialog(true);
          }
        } else {
          const dialogModalInfo: DialogModalInfo = {
            title: '¡Opps, ha ocurrido un error!',
            image: errorImage,
            description1: 'No tienes suficiente saldo disponible',
            description2: '',
          };
          setDialogModalInfo(dialogModalInfo);
          setOpenDialog(true);
        }
      }
    } else {
      redirectToHome();
    }
  };
  const createChallenge = async (challenge: Challenge) => {
    await addDoc(collection(db, 'Challenge'), challenge);
  };

  const onSubmit = (data: { [key: string]: any }) => {
    setChallenge(data as unknown as Challenge);
  };

  const redirectToHome = useCallback(() => history.replace('../../home'), []);

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
      <Box mt={4} sx={styles.root}>
        <Grid container direction="column" justifyContent="space-between" alignItems="stretch">
          <form noValidate autoComplete="off">
            <Grid item xs={12}>
              <TextField
                sx={styles.formControl}
                variant="outlined"
                required
                id="name"
                name="name"
                label="Nombre del reto"
                fullWidth
                margin="dense"
                type="text"
                {...register('name')}
                error={errors.name ? true : false}
                InputLabelProps={{ required: false }}
                defaultValue={nameAgainMatch}
              />
              <Typography color="error" variant="caption">
                {errors.name?.message}
              </Typography>
            </Grid>
            <Grid mt={2} item xs={12}>
              <TextField
                sx={styles.formControl}
                variant="outlined"
                required
                id="version"
                name="version"
                label="Versión del juego"
                type="text"
                fullWidth
                margin="dense"
                {...register('version')}
                error={errors.version ? true : false}
                helperText="Ejemplo: 2022"
                InputLabelProps={{ required: false }}
                defaultValue={versionAgainMatch}
              />
              <Typography color="error" variant="caption">
                {errors.version?.message}
              </Typography>
            </Grid>
            <Grid mt={2} item xs={12}>
              <TextField
                sx={styles.formControl}
                variant="outlined"
                required
                id="platform"
                name="platform"
                label="Plataforma"
                type="text"
                fullWidth
                margin="dense"
                {...register('platform')}
                error={errors.platform ? true : false}
                InputLabelProps={{ required: false }}
                defaultValue={platformAgarinMatch}
              />
              <Typography color="error" variant="caption">
                {errors.platform?.message}
              </Typography>
            </Grid>
            <Grid mt={2} item xs={12}>
              <TextField
                sx={styles.formControl}
                variant="outlined"
                required
                id="betAmount"
                name="betAmount"
                label="Monto a jugar"
                type="number"
                fullWidth
                margin="dense"
                InputLabelProps={{ required: false }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment sx={styles.dolarAdorment} position="start">
                      $ -
                    </InputAdornment>
                  ),
                }}
                {...register('betAmount')}
                error={errors.betAmount ? true : false}
                defaultValue={amountAgainMatch}
              />
              <Typography color="error" variant="caption">
                {errors.betAmount?.message}
              </Typography>
            </Grid>
            <Grid item xs={12} mt={1}>
              <Box height="fit-content" style={styles.informationBox}>
                <InfoOutlinedIcon style={styles.infoOutlinedIcon}></InfoOutlinedIcon>
                <Typography maxWidth={494} variant="caption">
                  Playfast cobrará una comisión del 10% sobre el monto total del reto
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} mt={2}>
              <TextField
                sx={styles.formControl}
                variant="outlined"
                required
                id="contact"
                name="contact"
                label="Método de contacto"
                type="text"
                fullWidth
                multiline
                rows={2}
                margin="dense"
                InputLabelProps={{ required: false }}
                {...register('contact')}
                error={errors.contact ? true : false}
                helperText="Por ejemplo número de teléfono, correo, redes sociales o player ID/User name de la consola."
                defaultValue={contactAgainMatch}
              />
              <Typography color="error" variant="caption">
                {errors.contact?.message}
              </Typography>
            </Grid>
            <Grid mt={2} mb={1}>
              <Typography variant="body1">
                Podés seleccionar una o varias fechas para llevar a cabo el reto.
              </Typography>
            </Grid>
            <Grid item xs={12} margin={'16px 0 0 0'}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Controller
                  name="date1"
                  control={control}
                  render={({ field }) => (
                    <DateTimePicker
                      renderInput={(params) => (
                        <TextField
                          id="date1"
                          error={errors.date1 ? true : false}
                          required
                          {...params}
                          sx={styles.formControl}
                          variant="outlined"
                          fullWidth
                        />
                      )}
                      label="Opción 1 - Fecha y hora del evento"
                      value={dateValue1}
                      onChange={(newValue) => {
                        setDateValue1(newValue);
                        field.onChange(newValue);
                      }}
                      {...field}
                      minDateTime={new Date()}
                    />
                  )}
                ></Controller>
              </LocalizationProvider>
              <Typography color="error" variant="caption">
                {errors.date1?.message}
              </Typography>
            </Grid>
            <Grid item xs={12} margin={'24px 0 0 0'}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Controller
                  name="date2"
                  control={control}
                  render={({ field }) => (
                    <DateTimePicker
                      renderInput={(params) => (
                        <TextField
                          id="date2"
                          error={errors.date2 ? true : false}
                          required
                          {...params}
                          sx={styles.formControl}
                          variant="outlined"
                          fullWidth
                        />
                      )}
                      label="Opción 2 - Fecha y hora del evento (opcional)"
                      value={dateValue2}
                      onChange={(newValue) => {
                        setDateValue2(newValue);
                        field.onChange(newValue);
                      }}
                      {...field}
                      minDateTime={new Date()}
                    />
                  )}
                ></Controller>
              </LocalizationProvider>
              <Typography color="error" variant="caption">
                {errors.date2?.message}
              </Typography>
            </Grid>
            <Grid item xs={12} margin={'24px 0 24px 0'}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Controller
                  name="date3"
                  control={control}
                  render={({ field }) => (
                    <DateTimePicker
                      renderInput={(params) => (
                        <TextField
                          id="date3"
                          error={errors.date3 ? true : false}
                          required
                          {...params}
                          sx={styles.formControl}
                          variant="outlined"
                          fullWidth
                        />
                      )}
                      label="Opción 3 - Fecha y hora del evento (opcional)"
                      value={dateValue3}
                      onChange={(newValue) => {
                        setDateValue3(newValue);
                        field.onChange(newValue);
                      }}
                      {...field}
                      minDateTime={new Date()}
                    />
                  )}
                ></Controller>
              </LocalizationProvider>
              <Typography color="error" variant="caption">
                {errors.date3?.message}
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
                {(!!userData.inTransaction && userData.inTransaction) ||
                (!!userData.inBalance && userData.inBalance) ? (
                  <>
                    <CustomTooltip
                      title="Tú balance se está actualizando"
                      onClose={handleTooltipClose}
                      open={openTooltip}
                    >
                      <Button variant="outlined" color="primary" onClick={handleTooltipOpen}>
                        CREAR RETO
                      </Button>
                    </CustomTooltip>
                  </>
                ) : (
                  <Button
                    //disabled={!isValid}
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit(onSubmit)}
                  >
                    CREAR RETO
                  </Button>
                )}
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Box>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={authContext.authStatus === AuthStatus.Loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  ) : (
    <></>
  );
};
export default ChallengeForm;
