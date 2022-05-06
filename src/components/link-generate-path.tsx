import React, { ReactNode } from 'react';
import { generatePath, Link as ReactRouterLink } from 'react-router-dom';

type LinkProps = {
  path: string;
  params: {
    [x: string]: string | number | boolean;
  };
  children: ReactNode;
};

export const Link = (props: LinkProps) => {
  const path = generatePath(props.path, props.params);
  return <ReactRouterLink to={path}>{props.children}</ReactRouterLink>;
};
