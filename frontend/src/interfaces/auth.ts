export interface IAuth {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    ageDeclaration: boolean;
    termOfUse: boolean;
}

export interface IAuthDTO {
    id: number;
    username: string;
    email: string;
    role: Role;
    created_at: Date;
}

type Role = "user" | "admin";
