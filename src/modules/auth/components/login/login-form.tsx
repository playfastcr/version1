import { AuthContext, AuthStatus } from '@context/auth.context';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import DialogModal from '@playfast/app/shared/components/dialog-modal';
import Image from '@playfast/assets/images/confirmation.png';
import { db } from '@service';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { FunctionComponent, useContext, useEffect } from 'react';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';

/* ––
 * –––– Component declaration
 * –––––––––––––––––––––––––––––––––– */
export const LoginForm: FunctionComponent = () => {
  /* –– Render setup
   * –––––––––––––––––––––––––––––––––– */
  const history = useHistory();
  const authContext = useContext(AuthContext);
  const [openModal, setOpenModal] = React.useState(false);

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Usuario no está disponible, intenta con otro'),
    password: Yup.string()
      .required('Contraseña no cumple con los requisitos mínimos')
      .min(6, 'Debe tener al menos 8 caractéres e incluir mayúsculas, minúsculas y números'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(validationSchema),
    //mode: 'all',
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (authContext.authStatus === AuthStatus.SignedIn) {
      redirectToHome();
    }
  }, [authContext]);

  const getUser = async (username: string, password: string) => {
    const q = query(collection(db, 'User'), where('username', '==', username));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length == 0) {
      setOpenModal(true);
    } else {
      querySnapshot.forEach((doc) => {
        authContext.signInWithEmail(doc.data().email, password);
      });
    }
  };

  const onSubmit = useCallback(
    (data: { [key: string]: string }) => getUser(data.username, data.password),
    []
  );

  const redirectToHome = useCallback(() => history.replace('../../home'), []);
  /* –– Render setup
   * –––––––––––––––––––––––––––––––––– */
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
      <Box mt={3}>
        <Grid container direction="column" justifyContent="space-between" alignItems="stretch">
          <form noValidate autoComplete="off">
            <Grid item>
              <TextField
                sx={styles.formControl}
                required
                id="username"
                name="username"
                label="Usuario"
                fullWidth
                margin="dense"
                {...register('username')}
                error={errors.username ? true : false}
                InputLabelProps={{ required: false }}
                variant="outlined"
              />
              <Typography variant="inherit">{errors.username?.message}</Typography>
            </Grid>
            <Grid item>
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
                variant="outlined"
              />
              <Typography variant="inherit">{errors.password?.message}</Typography>
            </Grid>
            <Grid item mt={2}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSubmit(onSubmit)}
                //disabled={!isValid}
              >
                Ingresar
              </Button>
            </Grid>
            <Grid container mt={3} direction="row" justifyContent="space-between">
              <Grid item mr={3}>
                <Typography variant="body1" color="primary" align="center">
                  <Link color="inherit" href={`/auth/sign-up`}>
                    Registrarme
                  </Link>
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body1" color="primary" align="center">
                  <Link color="inherit" href={`/auth/reset-password`}>
                    ¿Olvidaste tu contraseña?
                  </Link>
                </Typography>
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
      <DialogModal
        title=""
        image={Image}
        description="¡Opps, ha ocurrido un error!"
        description2="Usuario o contraseña incorrecta"
        open={openModal}
        setOpen={setOpenModal}
      ></DialogModal>
    </>
  );
};
export default LoginForm;
