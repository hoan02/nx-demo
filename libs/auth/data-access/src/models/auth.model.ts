import { IUser, IUserRole } from '@nx-demo/core/api-types';

type UserState = IUser & { token: string };

export type AuthState = {
  loggedIn: boolean;
  user: UserState;
};

export const initialUserValue: UserState = {
  _id: '',
  email: '',
  username: '',
  password: '',
  token: '',
  role: IUserRole.USER,
};

export const authInitialState: AuthState = {
  loggedIn: false,
  user: initialUserValue,
};
