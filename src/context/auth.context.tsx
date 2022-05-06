import { auth } from '@service';
import { signOut as signOutMehtod } from 'firebase/auth';
import React, { createContext, FunctionComponent, useCallback, useEffect, useState } from 'react';
import {
  useAuthState,
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
  useUpdatePassword,
} from 'react-firebase-hooks/auth';

import { Auth, AuthContextProps, AuthStatus } from './auth.types';

const defaultState: Auth = {
  authStatus: AuthStatus.Loading,
  signInWithEmail: null,
  signUpWithEmailAndPassword: null,
  signOut: null,
  getSession: null,
  forgotPassword: null,
  changePassword: null,
};

export const AuthContext = createContext(defaultState);

const AuthProvider: FunctionComponent<AuthContextProps> = ({ children }) => {
  const [authData, authLoading, authError] = useAuthState(auth);

  const [createUserWithEmailAndPassword, signUpData, signUpLoading, signUpError] =
    useCreateUserWithEmailAndPassword(auth, { sendEmailVerification: true });
  const [signInWithEmailAndPassword, signInData, signInLoading, signInError] =
    useSignInWithEmailAndPassword(auth);
  const [updatePassword, updateData, updateLoading] = useUpdatePassword(auth);

  const [authStatus, setAuthStatus] = useState(AuthStatus.Loading);

  useEffect(() => {
    setSession(authData, authLoading, authError);
  }, [authData, authLoading, authError]);

  useEffect(() => {
    setupSignUp();
    setSession(signUpData, signUpLoading, signUpError);
  }, [signUpData, signUpLoading, signUpError]);

  useEffect(() => {
    setupSignIn();
    setSession(signInData, signInLoading, signInError);
  }, [signInData, signInLoading, signInError]);

  useEffect(() => {
    //console.log(updateData);
    //console.log(updateLoading);
  }, [updateData, updateLoading]);

  const signUpWithEmailAndPassword = useCallback(
    (email: string, password: string) => createUserWithEmailAndPassword(email, password),
    [auth]
  );

  const setupSignUp = () => {
    if (!!signUpData && !signUpError) {
      setAuthStatus(AuthStatus.SignedIn);
    } else {
      setAuthStatus(AuthStatus.SignedOut);
    }
  };

  const signInWithEmail = useCallback(
    (email: string, password: string) => signInWithEmailAndPassword(email, password),
    [auth]
  );

  const setupSignIn = () => {
    if (!!signInData && !signInError) {
      setAuthStatus(AuthStatus.SignedIn);
    } else {
      setAuthStatus(AuthStatus.SignedOut);
    }
  };

  const signOut = useCallback(() => {
    setAuthStatus(AuthStatus.SignedOut);
    signOutMehtod(auth);
  }, [auth]);

  const getSession = () => {
    if (authData) {
      return authData;
    } else if (authError) {
      return authError;
    }
  };

  const forgotPassword = async (email: string) => {};

  const changePassword = useCallback((password: string) => updatePassword(password), [auth]);

  const setSession = (data: unknown, loading: unknown, error: unknown) => {
    if (data) {
      setAuthStatus(AuthStatus.SignedIn);
    } else if (loading) {
      setAuthStatus(AuthStatus.Loading);
    } else if (error) {
      setAuthStatus(AuthStatus.SignedOut);
    }
  };

  const state: Auth = {
    authStatus,
    signUpWithEmailAndPassword,
    signInWithEmail,
    signOut,
    getSession,
    forgotPassword,
    changePassword,
  };

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};

export type { Auth, AuthContextProps };
export { AuthStatus };

export default AuthProvider;
