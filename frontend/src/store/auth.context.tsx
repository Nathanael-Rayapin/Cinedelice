import { useEffect, useState } from 'react';
import { AuthContext, type IContextProviderProps } from './interface';
import type { ISigninDTO, Role, TokenPayload } from '../interfaces/auth';
import { jwtDecode } from "jwt-decode";

export default function AuthContextProvider({ children }: IContextProviderProps) {
  // Utile pour initialisé l'état de connexion mais ne vérifie
  // Pas l'expiration du token
  const [isAuth, setIsAuth] = useState<boolean>(() => {
    const token = localStorage.getItem("token");
    return !!token;
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiresAtStr = localStorage.getItem("expiresAt");

    if (token && expiresAtStr) {
      const expiresAt = Number(expiresAtStr);

      if (Date.now() < expiresAt) {
        setIsAuth(true);
        return;
      }
    }

    logout();
  }, []);

  // Ne pas stocker le role dans le localStorage car n'importe qui
  // pourra le modifier. N'importe qui peut aussi récupérer le token 
  // mais c'est une action plus contraignante
  const [role, setRole] = useState<Role>(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = jwtDecode<TokenPayload>(token);
      return payload.role;
    }
    return "user";
  });

  // Idem que le rôle mais pour le userId
  const [userId, setUserId] = useState<number | null>(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = jwtDecode<TokenPayload>(token);
      return payload.userId;
    }
    return null;
  });

  const login = (data: ISigninDTO) => {
    setIsAuth(true);
    setRole(data.user.role);
    localStorage.setItem('token', data.token);
    localStorage.setItem('expiresAt', data.expiresAt.toString());
  };

  const logout = () => {
    setIsAuth(false);
    localStorage.removeItem('token');
    localStorage.removeItem('expiresAt');
  };

  // Ce qu'on met à disposition pour tous les composants
  const ctxValue = {
    isAuth,
    setIsAuth,
    role,
    setRole,
    userId,
    setUserId,
    login,
    logout,
  };

  // Code utiliser dans main.tsx pour dire sur quoi j'applique le contexte
  return <AuthContext.Provider value={ctxValue}>{children}</AuthContext.Provider>;
}
