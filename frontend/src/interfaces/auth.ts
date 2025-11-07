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

export interface IAuthDTO {
    id: number;
    username: string;
    email: string;
    role: Role;
    created_at: Date;
}

type Role = "user" | "admin";
