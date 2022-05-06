import React, { FunctionComponent } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

import GameList from '../modules/game-list/game-list';

const GameRouter: FunctionComponent = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/game-list`}>
        <GameList />
      </Route>
      <Route exact path={path}>
        <Redirect to={`${path}/game`}></Redirect>
      </Route>
      <Route path="*">
        <Redirect to={`${path}/game`}></Redirect>
      </Route>
    </Switch>
  );
};

export default GameRouter;
