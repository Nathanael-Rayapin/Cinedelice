import { useState } from 'react';
import { GlobalUIContext, type IContextProviderProps } from './interface';
import type { IModalDelete, IModalDraft, IModalPreview } from '../interfaces/modal';

export default function GlobalUIContextProvider({ children }: IContextProviderProps) {
  // Utiliser pour mettre à jour l'UI
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalOptions, setModalOptions] = useState<IModalDraft | IModalPreview | IModalDelete | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Ce qu'on met à disposition pour tous les composants
  const ctxValue = {
    loading,
    setLoading,
    showModal,
    setShowModal,
    modalOptions,
    setModalOptions,
    errorMsg,
    setErrorMsg,
  };

  // Code utiliser dans main.tsx pour dire sur quoi j'applique le contexte
  return <GlobalUIContext.Provider value={ctxValue}>{children}</GlobalUIContext.Provider>;
}
