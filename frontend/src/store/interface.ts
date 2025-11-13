import { createContext, type ReactNode } from "react";
import type { ISigninDTO } from "../interfaces/auth";

export interface IContextProviderProps {
  children: ReactNode;
}

// Interface Contexte pour l'authentification
interface IAuthContextType {
  isAuth: boolean;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  login: (data: ISigninDTO) => void;
  logout: () => void;
}

export const AuthContext = createContext<IAuthContextType>({
    isAuth: false,
    setIsAuth: () => {},
    login: () => {},
    logout: () => {},
});

// Interface Contexte pour l'UI
interface IGlobalUIContextType {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  errorMsg: string | null;
  setErrorMsg: React.Dispatch<React.SetStateAction<string | null>>;
}

export const GlobalUIContext = createContext<IGlobalUIContextType>({
    loading: false,
    setLoading: () => {},
    errorMsg: null,
    setErrorMsg: () => {},
});