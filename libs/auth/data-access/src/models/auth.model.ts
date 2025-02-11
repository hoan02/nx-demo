import { IUser, IUserRole } from '@nx-demo/core/api-types';

type UserState = IUser & { accessToken: string };

export type AuthState = {
  loggedIn: boolean;
  user: UserState;
};

export const initialUserValue: UserState = {
  _id: '',
  email: '',
  username: '',
  password: '',
  role: IUserRole.USER,
  accessToken: '',
};

export const authInitialState: AuthState = {
  loggedIn: false,
  user: initialUserValue,
};
