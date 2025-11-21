import type { Role } from "./auth";

export interface IUpdateProfile {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IProfileDTO {
  user: IUserDTO;
}

export interface IUserDTO {
  id: number;
  username: string;
  email: string;
  role: Role;
  created_at: Date;
}