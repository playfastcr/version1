/* eslint-disable max-lines */
import { AuthContext, AuthStatus } from '@context/auth.context';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { db } from '@service';
import cryptojs from 'crypto-js';
import aes from 'crypto-js/aes';
import { User as FirebaseUser } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import moment from 'moment';
import React, { FunctionComponent, useContext, useEffect } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';

import RegisterGBSDataService from '../../services/registerGBS.service';
import UserGBS from '../../types/userGBS.type';

type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  identification: string;
  phone: string;
  password?: string;
  userGBS?: string;
  availableBalance?: number;
  inTransaction?: boolean;
  inBalance?: boolean;
};
/* ––
 * –––– Component declaration
 * –––––––––––––––––––––––––––––––––– */
export const RegisterForm: FunctionComponent = () => {
  /* –– Render setup
   * –––––––––––––––––––––––––––––––––– */
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Faltan datos por ingresar, por favor verifica la información')
      .min(2, 'Debe tener al menos 2 caractéres'),
    username: Yup.string()
      .required('Faltan datos por ingresar, por favor verifica la información')
      .min(2, 'Debe tener al menos 2 caractéres')
      .max(15, 'Debe tener un máximo de 15 caractéres'),
    email: Yup.string()
      .email('La dirección de correo electrónico no es valida, por favor verifica la información')
      .required(
        'La dirección de correo electrónico no es valida, por favor verifica la información'
      ),
    phone: Yup.string()
      .required('Faltan datos por ingresar, por favor verifica la información')
      .min(8, 'Debe tener al menos 8 digitos'),
    identification: Yup.string()
      .required('Faltan datos por ingresar, por favor verifica la información')
      .min(9, 'Debe tener al menos 9 digitos'),
    password: Yup.string()
      .required('Contraseña no cumple con los requisitos mínimos')
      .min(8, 'Debe tener al menos 8 caractéres e incluir mayúsculas, minúsculas y números'),
    confirmPassword: Yup.string()
      .required('Faltan datos por ingresar, por favor verifica la información')
      .oneOf([Yup.ref('password'), null], 'Contaseña no coincide'),
    acceptTerms: Yup.bool().oneOf(
      [true],
      'Faltan datos por ingresar, por favor verifica la información'
    ),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onSubmit',
  });

  const history = useHistory();
  const authContext = useContext(AuthContext);
  const [user, setUser] = useState<User>();
  const [userGBS, setUserGBS] = useState<UserGBS>();
  const [creatingUserGBS, setCreatingUserGBS] = useState(false);
  const [creatingTokenGBS, setCreatingTokenGBS] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [encryptedPassword, setEncryptedPassword] = useState<string>();
  const [key, setKey] = useState<string>();

  useEffect(() => {
    if (!creatingTokenGBS) {
      getTokenGBSData();
    }
  }, [authContext, user]);

  useEffect(() => {
    if (creatingUserGBS) {
      createUserGBS();
    }
  }, [userGBS]);

  useEffect(() => {
    if (!creatingUserGBS) {
      createUserGBSData();
    }
  }, [authContext, user, encryptedPassword]);

  const getTokenGBSData = () => {
    if (authContext.authStatus === AuthStatus.SignedIn) {
      if (user) {
        getTokenGBS();
      }
    }
  };

  const createUserGBSData = () => {
    if (authContext.authStatus === AuthStatus.SignedIn) {
      if (user && encryptedPassword) {
        setCreatingUserGBS(true);
        setUserGBS({
          address: '',
          agentId: `${import.meta.env.VITE_GBS_AGENT_ID}`,
          bookId: `${import.meta.env.VITE_GBS_BOOK_ID}`,
          city: '',
          country: `${import.meta.env.VITE_GBS_COUNTRY}`,
          customerBirthDate: moment().format('L'),
          email: user.email,
          firstName: user.name,
          key: key,
          lastName: '',
          loginID: user.identification,
          password: encryptedPassword,
          phone: user.phone,
          promoCode: '',
          referredBy: `${import.meta.env.VITE_GBS_REFERRED_BY}`,
          state: '',
          zip: '',
        });
      }
    }
  };

  const createUserData = () => {
    if (authContext.authStatus === AuthStatus.SignedIn) {
      if (user && userGBS) {
        createUser({
          id: (authContext.getSession() as FirebaseUser).uid,
          name: user.name,
          username: user.username,
          email: user.email,
          phone: user.phone,
          identification: user.identification,
          userGBS: user.userGBS,
          availableBalance: 0,
          inTransaction: false,
          inBalance: false,
        });
        setCreatingUserGBS(false);
        setUser(null);
        setUserGBS(null);
      }
      redirectToHome();
    }
  };
  const createUser = async (user: User) => {
    await addDoc(collection(db, 'User'), user);
  };

  const showErrorDialog = () => {
    setCreatingUserGBS(false);
    setUser(null);
    setUserGBS(null);
    setOpenDialog(true);
  };

  const getTokenGBS = async () => {
    setCreatingTokenGBS(true);
    await RegisterGBSDataService.getToken()
      .then((response: any) => {
        if (response.data.d.Message) {
          const key = response.data.d.Message;
          const iv = response.data.d.Message;

          setKey(key);

          const encryptedMessage = aes.encrypt(user.password, cryptojs.enc.Utf8.parse(key), {
            keySize: 128 / 8,
            iv: cryptojs.enc.Utf8.parse(iv),
            mode: cryptojs.mode.CBC,
            padding: cryptojs.pad.Pkcs7,
          });
          setCreatingTokenGBS(false);
          setEncryptedPassword(encryptedMessage.toString());
        } else {
          setCreatingTokenGBS(false);
          showErrorDialog();
        }
      })
      .catch((e: Error) => {
        showErrorDialog();
      });
  };

  const createUserGBS = async () => {
    await RegisterGBSDataService.create(userGBS)
      .then((response: any) => {
        if (response.data.d.Data.CustomerID) {
          user.userGBS = response.data.d.Data.CustomerID;
          createUserData();
        } else {
          showErrorDialog();
          //delete email in User
        }
      })
      .catch((e: Error) => {
        showErrorDialog();
      });
  };

  const onSubmit = (data: { [key: string]: any }) => {
    setUser(data as User);
    authContext.signUpWithEmailAndPassword(data.email, data.password);
  };

  const redirectToHome = useCallback(() => history.replace('../../home'), []);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const styles = {
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

  /* –– Render
   * –––––––––––––––––––––––––––––––––– */
  return (
    <>
      <Box mt={4}>
        <Grid container direction="column" justifyContent="space-between" alignItems="stretch">
          <form noValidate autoComplete="off">
            <Grid item xs={12}>
              <TextField
                sx={styles.formControl}
                required
                id="name"
                name="name"
                label="Nombre completo"
                fullWidth
                margin="dense"
                {...register('name')}
                error={errors.name ? true : false}
                InputLabelProps={{ required: false }}
              />
              <Typography color="error" variant="caption">
                {errors.name?.message}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                sx={styles.formControl}
                required
                id="username"
                name="username"
                label="Nombre de usuario"
                type="username"
                fullWidth
                margin="dense"
                {...register('username')}
                error={errors.username ? true : false}
                InputLabelProps={{ required: false }}
              />
              <Typography color="error" variant="caption">
                {errors.username?.message}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                sx={styles.formControl}
                id="email"
                name="email"
                label="Correo electrónico"
                type="email"
                fullWidth
                margin="dense"
                {...register('email')}
                error={errors.email ? true : false}
                InputLabelProps={{ required: false }}
              />
              <Typography color="error" variant="caption">
                {errors.email?.message}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                sx={styles.formControl}
                required
                id="identification"
                name="identification"
                label="Número de identificación"
                type="identification"
                fullWidth
                margin="dense"
                {...register('identification')}
                error={errors.identification ? true : false}
                InputLabelProps={{ required: false }}
              />
              <Typography color="error" variant="caption">
                {errors.identification?.message}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                sx={styles.formControl}
                id="phone"
                name="phone"
                label="Número telefónico (506 83456745)"
                type="phone"
                fullWidth
                margin="dense"
                {...register('phone')}
                error={errors.phone ? true : false}
                InputLabelProps={{ required: false }}
              />
              <Typography color="error" variant="caption">
                {errors.phone?.message}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                sx={styles.formControl}
                required
                id="password"
                name="password"
                label="Contraseña"
                type="password"
                fullWidth
                margin="dense"
                {...register('password')}
                error={errors.password ? true : false}
                InputLabelProps={{ required: false }}
              />
              <Typography color="error" variant="caption">
                {errors.password?.message}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                sx={styles.formControl}
                required
                id="confirmPassword"
                name="confirmPassword"
                label="Confirmar contraseña"
                type="password"
                fullWidth
                margin="dense"
                {...register('confirmPassword')}
                error={errors.confirmPassword ? true : false}
                InputLabelProps={{ required: false }}
              />
              <Typography color="error" variant="caption">
                {errors.confirmPassword?.message}
              </Typography>
            </Grid>
            <Grid item xs={12} mt={3} mb={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    name="acceptTerms"
                    defaultValue="false"
                    {...register('acceptTerms')}
                  />
                }
                label={
                  <Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                  >
                    <Grid item>
                      <Typography
                        color={errors.acceptTerms ? 'error' : 'inherit'}
                        variant="caption"
                      >
                        Para registrarte debes aceptar los&nbsp;
                        <Link color="primary" href="#">
                          Términos & Condiciones
                        </Link>
                      </Typography>
                    </Grid>
                  </Grid>
                }
              />
              <Typography variant="caption" color="error">
                {errors.acceptTerms ? errors.acceptTerms.message : ''}
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
                <Button variant="outlined" color="primary" href={`/home/`}>
                  CANCELAR
                </Button>
              </Grid>
              <Grid item>
                <Button
                  //disabled={!isValid}
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit(onSubmit)}
                >
                  REGISTRARME
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Box>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            backgroundColor: '#121721',
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">{'El usuario no se pudo crear'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Ha ocurrido un error al crear el usuario. Recuerda que tu correo e identificación solo
            puede ser registrado una vez en el sistema. Vuelve a intertar de nuevo.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={authContext.authStatus === AuthStatus.Loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};
export default RegisterForm;
