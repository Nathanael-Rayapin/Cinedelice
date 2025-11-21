import type { IUserDTO } from "./user";

export interface ISignup {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  ageDeclaration: boolean;
  termOfUse: boolean;
}

export interface ISignin {
  email: string;
  password: string;
}

export interface ISignupDTO {
  id: number;
  username: string;
  email: string;
  role: Role;
  created_at: Date;
}

export interface ISigninDTO {
  user: IUserDTO;
  token: string;
  expiresAt: number;
}

export type Role = 'user' | 'admin';

export type TokenPayload = {
  userId: number;
  role: Role;
};
