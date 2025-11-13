import { useState} from 'react';
import { AuthContext, type IAuthContextProviderProps } from './interface';

export default function AuthContextProvider({ children }: IAuthContextProviderProps) {
  const [isAuth, setIsAuth] = useState(false);

  const ctxValue = {
    isAuth,
    setIsAuth,
  };

    return (
        <AuthContext.Provider value={ctxValue}>
            {children}
        </AuthContext.Provider>
    );
}