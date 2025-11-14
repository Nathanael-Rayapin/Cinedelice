import {useState } from 'react';
import { GlobalUIContext, type IContextProviderProps } from './interface';

export default function GlobalUIContextProvider({ children }: IContextProviderProps) {
  // Utiliser pour mettre à jour l'UI
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Ce qu'on met à disposition pour tous les composants
  const ctxValue = {
    loading,
    setLoading,
    errorMsg,
    setErrorMsg,
  };

  // Code utiliser dans main.tsx pour dire sur quoi j'applique le contexte
  return <GlobalUIContext.Provider value={ctxValue}>{children}</GlobalUIContext.Provider>;
}
