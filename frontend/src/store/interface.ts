import { createContext, type ReactNode } from "react";
import type { ISigninDTO } from "../interfaces/auth";

interface IAuthContextType {
  isAuth: boolean;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  login: (data: ISigninDTO) => void;
  logout: () => void;
}

export interface IAuthContextProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<IAuthContextType>({
    isAuth: false,
    setIsAuth: () => {},
    login: () => {},
    logout: () => {},
});