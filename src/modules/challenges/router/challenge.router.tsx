import React, { FunctionComponent } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

import ChallengesView from '../views/ChallengesView';

const ChallengeRouter: FunctionComponent = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/challenge/:challengeId`}>
        <ChallengesView />
      </Route>
      <Route path={`${path}/challenge/`}>
        <ChallengesView />
      </Route>
      <Route exact path={path}>
        <Redirect to={`${path}/challenge`}></Redirect>
      </Route>
      <Route path="*">
        <Redirect to={`${path}/challenge`}></Redirect>
      </Route>
    </Switch>
  );
};

export default ChallengeRouter;
