import React, { FunctionComponent } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

import HomeView from '../views/HomeView';

const HomeRouter: FunctionComponent = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/`}>
        <HomeView />
      </Route>
      <Route exact path={path}>
        <Redirect to={`${path}/`}></Redirect>
      </Route>
      <Route path="*">
        <Redirect to={`${path}/`}></Redirect>
      </Route>
    </Switch>
  );
};

export default HomeRouter;
