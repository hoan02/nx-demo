export enum IUserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface IUser {
  _id: string;
  username: string;
  password: string;
  fullName?: string;
  email: string;
  role: IUserRole;
  profilePicture?: string;
  status?: string;
  lastLogin?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  phoneNumber?: string;
}
