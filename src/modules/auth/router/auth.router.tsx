import React, { FunctionComponent } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

import SignIn from '../modules/sign-in/sign-in.component';
import SignUp from '../modules/sign-up/sign-up.component';
import ResetPassword from '../modules/reset-password/reset-password.component';
/* ––
 * –––– Router declaration
 * –––––––––––––––––––––––––––––––––– */
const AuthRouter: FunctionComponent = () => {
  const { path } = useRouteMatch();
  /* –– Render
   * –––––––––––––––––––––––––––––––––– */
  return (
    <Switch>
      <Route path={`${path}/sign-in`}>
        <SignIn />
      </Route>
      <Route path={`${path}/reset-password`}>
        <ResetPassword />
      </Route>
      <Route path={`${path}/sign-up`}>
        <SignUp />
      </Route>
      <Route exact path={path}>
        <Redirect to={`${path}/sign-in`}></Redirect>
      </Route>
      <Route path="*">
        <Redirect to={`${path}/sign-in`}></Redirect>
      </Route>
    </Switch>
  );
};

export default AuthRouter;
