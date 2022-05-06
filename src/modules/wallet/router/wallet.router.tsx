import React, { FunctionComponent } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

import WalletView from '../views/WalletView';

const WalletRouter: FunctionComponent = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/wallet`}>
        <WalletView />
      </Route>
      <Route exact path={path}>
        <Redirect to={`${path}/wallet`}></Redirect>
      </Route>
      <Route path="*">
        <Redirect to={`${path}/wallet`}></Redirect>
      </Route>
    </Switch>
  );
};

export default WalletRouter;
