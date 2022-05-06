import React, { FunctionComponent } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

const SimpleComponent = () => <h1>User works</h1>; // remove this component and use the correct component instead

const UserRouter: FunctionComponent = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/user`}>
        <SimpleComponent />
      </Route>
      <Route exact path={path}>
        <Redirect to={`${path}/user`}></Redirect>
      </Route>
      <Route path="*">
        <Redirect to={`${path}/user`}></Redirect>
      </Route>
    </Switch>
  );
};

export default UserRouter;
