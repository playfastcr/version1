import React, { FunctionComponent } from 'react';
import { Route } from 'react-router-dom';
// A special wrapper for <Route> that knows how to
// handle "sub"-routes by passing them in a `routes`
// prop to the component it renders.
// https://reactrouter.com/web/example/route-config
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RouteWithSubRoutes: FunctionComponent = (route: any) => (
  <Route
    path={route.path}
    render={(props: unknown) => (
      // pass the sub-routes down to keep nesting
      <route.component {...props} exact={route.exact} />
    )}
  />
);
