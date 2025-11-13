import { createContext, type ReactNode } from "react";

interface IAuthContextType {
  isAuth: boolean;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => void;
}

export interface IAuthContextProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<IAuthContextType>({
    isAuth: false,
    setIsAuth: () => {},
    logout: () => {},
});