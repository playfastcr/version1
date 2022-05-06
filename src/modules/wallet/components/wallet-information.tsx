/* eslint-disable max-lines */
import { AuthContext, AuthStatus } from '@context/auth.context';
import { Box, Button, Grid, Modal, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import RegisterGBSDataService from '@playfast/app/auth/services/registerGBS.service';
import CustomerGBS from '@playfast/app/auth/types/customerGBS.type';
import EmptyBalanceGrid from '@playfast/assets/images/empty-balance-grid.png';
import { db } from '@service';
import { User as FirebaseUser, User } from 'firebase/auth';
import { collection, DocumentData, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';

/* ––
 * –––– Component declaration
 * –––––––––––––––––––––––––––––––––– */
const WalletInformation: FunctionComponent = () => {
  /* –– Render setup
   * –––––––––––––––––––––––––––––––––– */
  const [user, setUser] = useState<User>();
  const [userData, setUserData] = React.useState<DocumentData>();
  const [creatingTokenGBS, setCreatingTokenGBS] = useState(false);
  const [userTokenGBS, setUserTokenGBS] = useState('');

  const transactionRef = collection(db, 'Transaction');
  const queryOrderByDate = query(transactionRef, orderBy('dateTransaction', 'desc'));

  const [transactionData, transactionLoading, transactionError] = useCollection(queryOrderByDate, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  const [transactions, setTransaction] = useState([]);
  const authContext = useContext(AuthContext);
  const [openModal, setOpenModal] = React.useState(false);

  const columns = [
    {
      field: 'id',
      hide: true,
      identity: true,
      sortable: false,
    },
    {
      field: 'date',
      headerName: 'Fecha del movimiento',
      width: 250,
      editable: false,
      sortable: false,
    },
    {
      field: 'type',
      headerName: 'Tipo de movimiento',
      width: 400,
      editable: false,
      sortable: false,
    },
    {
      field: 'detail',
      headerName: 'Detalle',
      width: 300,
      editable: false,
      sortable: false,
    },
    {
      field: 'amount',
      headerName: 'Monto',
      width: 150,
      editable: false,
      sortable: false,
    },
  ];

  useEffect(() => {
    const transactions: any = [];
    if (!!transactionData && !transactionError && !!userData) {
      const updateTransactions = transactionData.docs.filter((curTransaction) => {
        return curTransaction.data().createdByUserGBS === userData.userGBS;
      });

      updateTransactions.map((transaction, i) => {
        const transactionType =
          typeof transaction.data().type !== 'undefined' &&
          transaction.data().type !== null &&
          transaction.data().type !== ''
            ? transaction.data().type === 'D'
              ? '-$ '
              : '+$ '
            : '';
        transactions.push({
          id: i + 1,
          date: transaction.data().dateTransaction,
          type: transaction.data().typeTransaction,
          detail: transaction.data().detail,
          amount: transactionType + transaction.data().amount,
        });
      });
      setTransaction(transactions);
    } else {
      //console.log('error');
    }
  }, [transactionData, transactionError, userData]);

  useEffect(() => {
    getUser();
  }, [authContext]);

  useEffect(() => {
    getUserInfo();
  }, [user]);
  const handleClose = () => setOpenModal(false);

  const getUser = () => {
    if (authContext.authStatus === AuthStatus.SignedIn) {
      const user = authContext.getSession() as FirebaseUser;
      setUser(user);
    }
  };

  const getUserInfo = async () => {
    if (user) {
      const q = query(collection(db, 'User'), where('id', '==', user.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUserData(doc.data());
      });
    }
  };

  useEffect(() => {
    if (userData) getTokenGBS(userData.userGBS);
  }, [userData]);

  const getTokenGBS = async (userGBS: string) => {
    if (userGBS) {
      setCreatingTokenGBS(true);
      const customerGBS: CustomerGBS = {
        customerID: userGBS,
        systemID: `${import.meta.env.VITE_GBS_SYSTEM_ID}`,
        systemPassword: `${import.meta.env.VITE_GBS_SYSTEM_PASSWORD}`,
      };
      await RegisterGBSDataService.getUserToken(customerGBS)
        .then((response: any) => {
          if (response.data.d.Message) {
            setCreatingTokenGBS(false);
            //setUserTokenGBS(response.data.d.Data.Token);
            setUserTokenGBS(
              `https://qa.ticosports.com/sports/Pages/LENCashier/Index.aspx?token=${response.data.d.Data.Token}&systemId=gameFast`
            );
          } else {
            setCreatingTokenGBS(false);
            //showErrorDialog();
          }
        })
        .catch((e: Error) => {
          //showErrorDialog();
        });
    }
  };

  const styles = {
    balanceContainer: {
      backgroundColor: '#1E2534',
      minHeight: '184px',
      borderRadius: '15px',
      height: 'fit-content',
    },
    dataGrid: {
      height: '400px',
    },
    modalContainer: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: 900,
      width: '90%',
      p: 4,
      color: 'white',
      background: '#121721',
      padding: 0,
      overflow: 'scroll',
      overflowX: 'hidden',
      minWidth: '320px',
      borderRadius: '10px',
    },
    modalContent: {
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
      paddingTop: '56.25%',
    },
    iframe: {
      position: 'absolute',
      top: '0',
      left: '0',
      bottom: '0',
      right: '0',
      width: '100%',
      height: '100%',
    },
  };

  /* –– Render
   * –––––––––––––––––––––––––––––––––– */
  return !!transactions && !transactionError ? (
    <>
      <Grid px={8}>
        <Grid px={5}>
          <Grid container xs={12} sm={10} md={8} lg={6} sx={styles.balanceContainer}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Grid item xs={12} justifyContent="center" alignItems="center">
                {userData ? (
                  <Box mt="20%">
                    <Typography variant="h4" color="white" margin="16px 24px;">
                      $ {userData.availableBalance}
                    </Typography>
                    {(!!userData.inTransaction && userData.inTransaction) ||
                    (!!userData.inBalance && userData.inBalance) ? (
                      <Typography variant="h6" color="primary" margin="16px 24px;" maxWidth={400}>
                        Actualizando saldo...
                      </Typography>
                    ) : (
                      <Typography variant="h6" color="primary" margin="16px 24px;" maxWidth={400}>
                        Saldo actual
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <></>
                )}
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} justifyContent="center" alignItems="center">
              <Box mt="40%" mb="20%" ml="10%">
                <Button variant="contained" onClick={() => setOpenModal(true)}>
                  CARGAR DINERO
                </Button>
                {/*<Button
                  sx={{ marginTop: '5px' }}
                  variant="contained"
                  onClick={() => window.open(userTokenGBS, '_blank')}
                >
                  CARGAR DINERO
                </Button>*/}
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid px={3} mt={8} xs={12}>
          <Typography variant="h6" color="white" margin="16px 24px;" maxWidth={400}>
            Movimientos
          </Typography>
        </Grid>
        <Grid px={5} pb={8}>
          {transactions.length > 0 ? (
            <DataGrid
              rows={transactions}
              columns={columns}
              getRowId={(transaction) => transaction.id}
              pageSize={5}
              rowsPerPageOptions={[5]}
              sx={styles.dataGrid}
              disableColumnMenu
              disableColumnFilter
              disableColumnSelector
            />
          ) : (
            <Grid item xs={12} mt={12} justifyContent="center" alignItems="center">
              <Box>
                <Grid container direction="column" justifyContent="center" alignItems="center">
                  <Grid item xs="auto">
                    <img
                      src={EmptyBalanceGrid}
                      width={167}
                      height={146}
                      style={{ objectFit: 'cover' }}
                    />
                  </Grid>
                  <Grid item xs="auto" pt={2}>
                    <Typography
                      id="modal-modal-title"
                      textAlign="center"
                      variant="h5"
                      component="h5"
                      color="white"
                    >
                      Aún no se han registrado movimientos
                    </Typography>
                  </Grid>
                  <Grid item xs="auto" pt={2}>
                    <Typography color="white" variant="body1" align="center">
                      Agregá dinero a tu billetera y comenzá a crear retos
                    </Typography>
                  </Grid>
                  <Grid item xs="auto" pt={2}>
                    <Typography
                      variant="body1"
                      align="center"
                      id="modal-modal-description"
                      sx={{ mt: 2 }}
                    ></Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          )}
          <Modal open={openModal} onClose={handleClose}>
            <Box sx={styles.modalContainer}>
              <Box sx={styles.modalContent}>
                <iframe
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  src={`${userTokenGBS}`}
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    bottom: '0',
                    right: '0',
                    width: '100%',
                    height: '100%',
                  }}
                />
              </Box>
            </Box>
          </Modal>
        </Grid>
      </Grid>
    </>
  ) : (
    <></>
  );
};

export default WalletInformation;
