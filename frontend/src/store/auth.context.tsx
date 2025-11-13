import { useState } from 'react';
import { AuthContext, type IAuthContextProviderProps } from './interface';

export default function AuthContextProvider({ children }: IAuthContextProviderProps) {
  // Utiliser pour mettre à jour mon authentification
  const [isAuth, setIsAuth] = useState(false);

  // Utiliser pour me déconnecter
  const logout = () => {
    setIsAuth(false);
    localStorage.removeItem('token');
  };

  // Ce qu'on met à disposition pour tous les composants
  const ctxValue = {
    isAuth,
    setIsAuth,
    logout,
  };

  // Code utiliser dans main.tsx pour dire sur quoi j'applique le contexte
  return (
    <AuthContext.Provider value={ctxValue}>
      {children}
    </AuthContext.Provider>
  );
}