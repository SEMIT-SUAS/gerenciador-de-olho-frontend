import { createContext, useContext, useState } from 'react';
import type { FC, ReactNode, SetStateAction, Dispatch } from 'react';
import { useOcorrencias } from './OcorrenciasContext';
import type { Denuncia } from '../types/Denuncia';
import type { Acao } from '../types/Acao';

interface VincularDenunciaContextType {
  denunciaParaVincular: Denuncia | null;
  setDenunciaParaVincular: Dispatch<SetStateAction<Denuncia | null>>;
  startLinking: (denuncia: Denuncia) => void;
  cancelLinking: () => void;
  confirmLink: (acaoId: number) => void;
  isSelectingAcaoInMap: boolean;
  setIsSelectingAcaoInMap: Dispatch<SetStateAction<boolean>>;
  acaoParaVincular: Acao | null;
  setAcaoParaVincular: Dispatch<SetStateAction<Acao | null>>;
}

const VincularDenunciaContext = createContext<
  VincularDenunciaContextType | undefined
>(undefined);

export const VincularDenunciaProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { vincularDenunciaAcao } = useOcorrencias();
  const [isSelectingAcaoInMap, setIsSelectingAcaoInMap] =
    useState<boolean>(false);
  const [denunciaParaVincular, setDenunciaParaVincular] =
    useState<Denuncia | null>(null);
  const [acaoParaVincular, setAcaoParaVincular] = useState<Acao | null>(null);

  const startLinking = (denuncia: Denuncia) => {
    setDenunciaParaVincular(denuncia);
  };

  const cancelLinking = () => {
    setDenunciaParaVincular(null);
    setIsSelectingAcaoInMap(false); // Garante que o modo de seleção no mapa também seja resetado.
  };

  const confirmLink = (acaoId: number) => {
    if (denunciaParaVincular) {
      vincularDenunciaAcao(denunciaParaVincular.id, acaoId);
      setDenunciaParaVincular(null); // Limpa o estado após a confirmação.
      setIsSelectingAcaoInMap(false);
    }
  };

  const value = {
    denunciaParaVincular,
    setDenunciaParaVincular,
    startLinking,
    cancelLinking,
    confirmLink,
    isSelectingAcaoInMap,
    setIsSelectingAcaoInMap,
    acaoParaVincular,
    setAcaoParaVincular,
  };

  return (
    <VincularDenunciaContext.Provider value={value}>
      {children}
    </VincularDenunciaContext.Provider>
  );
};

/**
 * Hook customizado para consumir o VincularDenunciaContext de forma segura e limpa.
 */
export const useVincularDenunciaContext = () => {
  const context = useContext(VincularDenunciaContext);
  // CORREÇÃO: A mensagem de erro agora corresponde aos nomes corretos do contexto e provedor.
  if (context === undefined) {
    throw new Error(
      'useVincularDenunciaContext deve ser usado dentro de um VincularDenunciaProvider',
    );
  }
  return context;
};
