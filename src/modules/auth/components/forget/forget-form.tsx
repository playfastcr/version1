import { AuthContext, AuthStatus } from '@context/auth.context';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import DialogModal from '@playfast/app/shared/components/dialog-modal';
import Image from '@playfast/assets/images/user-error.png';
import { auth, db } from '@service';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import React, { FunctionComponent, useContext, useEffect } from 'react';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';

/* ––
 * –––– Component declaration
 * –––––––––––––––––––––––––––––––––– */
export const ForgetForm: FunctionComponent = () => {
  /* –– Render setup
   * –––––––––––––––––––––––––––––––––– */
  const history = useHistory();
  const authContext = useContext(AuthContext);
  const [openModal, setOpenModal] = React.useState(false);

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Usuario no está disponible, intenta con otro'),
    email: Yup.string()
      .email('La dirección de correo electrónico no es valida, por favor verifica la información')
      .required(
        'La dirección de correo electrónico no es valida, por favor verifica la información'
      ),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'all',
  });

  useEffect(() => {
    if (authContext.authStatus === AuthStatus.SignedIn) {
      redirectToHome();
    }
  }, [authContext]);

  const getUser = async (username: string, email: string) => {
    const q = query(collection(db, 'User'), where('username', '==', username));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length == 0) {
      setOpenModal(true);
    } else {
      querySnapshot.forEach((doc) => {
        if (email == doc.data().email) {
          addDoc(collection(db, 'ResetPassword'), {
            email: email,
          });
          redirectToHome();
        } else {
          setOpenModal(true);
        }
      });
    }
  };

  const onSubmit = useCallback(
    (data: { [key: string]: string }) => getUser(data.username, data.email),
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
            <Grid item mt={2}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSubmit(onSubmit)}
                disabled={!isValid}
              >
                Enviar correo electrónico
              </Button>
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
        description="¡Tus datos son incorrectos!"
        description2="Verifíca e intentá nuevamente"
        open={openModal}
        setOpen={setOpenModal}
      ></DialogModal>
    </>
  );
};
export default ForgetForm;
