import { ComponentType } from 'react';

export default interface Routes {
  [key: string]: Route;
}

export interface Route {
  path: string;
  param?: string;
  exact?: boolean;
  component: ComponentType;
}
