import type { IConnectedUser } from "./auth";

export interface IUpdateProfile {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface IProfileDTO {
    user: IConnectedUser;
}