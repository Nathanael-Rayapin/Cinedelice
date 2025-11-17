import { useState } from 'react';
import { AuthContext, type IContextProviderProps } from './interface';
import type { ISigninDTO } from '../interfaces/auth';

export default function AuthContextProvider({ children }: IContextProviderProps) {
  // Utiliser pour mettre à jour mon authentification
  const [isAuth, setIsAuth] = useState<boolean>(() => {
    const token = localStorage.getItem("token");
    return !!token;
  });

  // Utiliser pour me conencter
  const login = (data: ISigninDTO) => {
    setIsAuth(true);
    localStorage.setItem('token', data.token);
  };

  // Utiliser pour me déconnecter
  const logout = () => {
    setIsAuth(false);
    localStorage.removeItem('token');
  };

  // Ce qu'on met à disposition pour tous les composants
  const ctxValue = {
    isAuth,
    setIsAuth,
    login,
    logout,
  };

  // Code utiliser dans main.tsx pour dire sur quoi j'applique le contexte
  return <AuthContext.Provider value={ctxValue}>{children}</AuthContext.Provider>;
}
