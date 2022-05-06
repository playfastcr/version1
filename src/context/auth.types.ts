import { User } from 'firebase/auth';
import { ReactNode } from 'react';

export enum AuthStatus {
  Loading,
  SignedIn,
  SignedOut,
}

export interface Auth {
  authStatus: AuthStatus;
  signInWithEmail: (username: string, password: string) => Promise<void>;
  signUpWithEmailAndPassword: (username: string, password: string) => Promise<void>;
  signOut: () => void;
  getSession: () => Error | User;
  forgotPassword: (username: string) => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
}

export type AuthContextProps = {
  children: ReactNode;
};
