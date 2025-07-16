import { createContext, useContext, useState, useEffect } from 'react';
import type { FC, ReactNode, SetStateAction, Dispatch } from 'react';
import { useOcorrenciasContext } from './OcorrenciasContext';
import type { Denuncia } from '../types/Denuncia';
import type { Acao } from '../types/Acao';
import denunciasService from '../services/denunciasService';
import { useFilters } from './FiltersContext';
import { useAddAcao } from './AddAcaoContext';

interface VincularItemContextType {
  denunciaParaVincular: Denuncia | null;
  setDenunciaParaVincular: Dispatch<SetStateAction<Denuncia | null>>;
  startLinking: (denuncia: Denuncia) => void;
  cancelLinking: () => void;
  confirmLink: (acaoId: number) => void;
  isSelectingAcaoInMap: boolean;
  setIsSelectingAcaoInMap: Dispatch<SetStateAction<boolean>>;
  acaoParaVincular: Acao | null,
  setAcaoParaVincular: Dispatch<SetStateAction<Acao | null>>
  denunciasVinculadas: Denuncia[];
  setDenunciasVinculadas: Dispatch<SetStateAction<Denuncia[]>>;
  isAddingDenunciaAcao: boolean | null,
  setIsAddingDenunciaAcao:Dispatch<SetStateAction<boolean>>
}

const VincularItemContext = createContext<VincularItemContextType | undefined>(undefined);

export const VincularItemProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { setDenuncias } = useOcorrenciasContext();
  const [isSelectingAcaoInMap, setIsSelectingAcaoInMap] = useState<boolean>(false);
  const [denunciaParaVincular, setDenunciaParaVincular] = useState<Denuncia | null>(null);
  const [acaoParaVincular, setAcaoParaVincular] = useState<Acao | null>(null);
  const [isAddingDenunciaAcao, setIsAddingDenunciaAcao] = useState <boolean>(false);
  const {denunciasVinculadas, setDenunciasVinculadas} = useAddAcao();
   const { setIsVisibleAcoesInMap, setFiltroDenunciasComAcao } = useFilters();
  

  useEffect(() => {
    if (isAddingDenunciaAcao) {
      setIsVisibleAcoesInMap(false);
      setFiltroDenunciasComAcao('sem_acao');
    } else {
      setIsVisibleAcoesInMap(true);
      setFiltroDenunciasComAcao('desabilitado');
    }

    setDenunciasVinculadas([]);
  }, [isAddingDenunciaAcao]);

  const vincularDenunciaAcao = async (denunciaId: number, acaoId: number) => {
    try {
      const denunciaAtualizada = await denunciasService.vincularDenunciaToAcao(
        denunciaId,
        acaoId,
      );
      setDenuncias((prev) =>
        prev.map((d) => (d.id === denunciaId ? denunciaAtualizada : d)),
      );
      console.log('Denúncia vinculada com sucesso:', denunciaAtualizada);
    } catch (error) {
      console.error('Falha ao vincular denúncia:', error);
      alert('Não foi possível vincular a denúncia.');
    }
  };


  const startLinking = (item: Denuncia | Acao) => {
    if('secretaria' in item) {
      setAcaoParaVincular(item)
    } else {
      setDenunciaParaVincular(item)
    }
  };

  const cancelLinking = () => {
    setDenunciaParaVincular(null);
    setDenunciasVinculadas([]);
    setAcaoParaVincular(null);
    setIsSelectingAcaoInMap(false);
  };

  const confirmLink = (itemId: number) => {
    if (denunciaParaVincular) {
      vincularDenunciaAcao(denunciaParaVincular.id, itemId);
      setDenunciaParaVincular(null); 
      setIsSelectingAcaoInMap(false);
    } else if (acaoParaVincular) {
      {denunciasVinculadas.map (denuncia => denunciasService.vincularDenunciaToAcao(denuncia.id, itemId))}
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
    denunciasVinculadas,
    setDenunciasVinculadas,
    isAddingDenunciaAcao,
    setIsAddingDenunciaAcao
  };

  return <VincularItemContext.Provider value={value}>{children}</VincularItemContext.Provider>;
};

export const useVincularItemContext = () => {
  const context = useContext(VincularItemContext);

  if (context === undefined) {
    throw new Error('useVincularItemContext deve ser usado dentro de um VincularItemProvider');
  }
  return context;
};
