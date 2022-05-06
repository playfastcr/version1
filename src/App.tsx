import './App.css';

import { AuthContext, AuthStatus } from '@context/auth.context';
import { ThemeProvider } from '@mui/material';
import AuthRouter from '@playfast/app/auth/router/auth.router';
import ChallengeRouter from '@playfast/app/challenges/router/challenge.router';
import GameRouter from '@playfast/app/games/router/game.router';
import HomeRouter from '@playfast/app/home/router/home.router';
import UserRouter from '@playfast/app/user/router/user.router';
import WalletRouter from '@playfast/app/wallet/router/wallet.router';
import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import { darkTheme } from './themes';

const App: FunctionComponent = () => {
  const authContext = useContext(AuthContext);
  const [isLogged, setIsLogged] = useState<boolean>(false);

  useEffect(() => {
    const authLoading = AuthStatus.Loading === authContext.authStatus;
    if (AuthStatus.SignedIn === authContext.authStatus && !authLoading) {
      setIsLogged(true);
    } else if (AuthStatus.SignedOut === authContext.authStatus && !authLoading) {
      setIsLogged(false);
    }
  }, [authContext]);

  return (
    <ThemeProvider theme={darkTheme}>
      {isLogged ? (
        <Router>
          <Switch>
            <Route path="/home">
              <HomeRouter />
            </Route>
            <Route path="/auth">
              <AuthRouter />
            </Route>
            <Route path="/games">
              <GameRouter />
            </Route>
            <Route path="/challenges">
              <ChallengeRouter />
            </Route>
            <Route path="/user">
              <UserRouter />
            </Route>
            <Route path="/wallet">
              <WalletRouter />
            </Route>
            <Route exact path="/">
              <Redirect to="/home"></Redirect>
            </Route>
            <Route path="*">
              <Redirect to="/home"></Redirect>
            </Route>
          </Switch>
        </Router>
      ) : (
        <Router>
          <Switch>
            <Route path="/home">
              <HomeRouter />
            </Route>
            <Route path="/auth">
              <AuthRouter />
            </Route>
            <Route exact path="/">
              <Redirect to="/home"></Redirect>
            </Route>
          </Switch>
        </Router>
      )}
    </ThemeProvider>
  );
};

export default App;
