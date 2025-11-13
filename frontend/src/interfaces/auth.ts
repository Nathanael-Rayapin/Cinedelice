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
    user: IConnectedUser;
    token: string;
}

export interface IProfileDTO {
    user: IConnectedUser;
}

export interface IConnectedUser {
    id: number;
    username: string;
    email: string;
    role: Role;
    created_at: Date;
}

type Role = "user" | "admin";
