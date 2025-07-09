import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import type { StatusModel } from '../types/StatusModel';
import type { Categorias } from '../types/CategoriaDenuncia';
import type { Secretarias } from '../types/Secretaria';
import { useOcorrenciasContext } from './ocorrenciasContext';
import type { Denuncia } from '../types/Denuncia';
import type { Acao } from '../types/Acao';

type FiltersContextProps = {
  isVisibleDenunciasInMap: boolean;
  isVisibleAcoesInMap: boolean;
  setIsVisibleDenunciasInMap: Dispatch<SetStateAction<boolean>>;
  setIsVisibleAcoesInMap: Dispatch<SetStateAction<boolean>>;
  filtroStatusDenuncia: 'todos' | StatusModel;
  setFiltroStatusDenuncia: Dispatch<SetStateAction<'todos' | StatusModel>>;
  filtroStatusAcao: 'todos' | StatusModel;
  setFiltroStatusAcao: Dispatch<SetStateAction<'todos' | StatusModel>>;
  filtroCategoria: 'todas' | Categorias | null;
  setFiltroCategoria: Dispatch<SetStateAction<'todas' | Categorias | null>>;
  filtroSecretaria: 'todas' | Secretarias | null;
  setFiltroSecretaria: Dispatch<SetStateAction<'todas' | Secretarias | null>>;
  denunciasFiltradas: Denuncia[];
  acoesFiltradas: Acao[];
};

const FiltersContext = createContext({} as FiltersContextProps);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [isVisibleDenunciasInMap, setIsVisibleDenunciasInMap] = useState(true);
  const [isVisibleAcoesInMap, setIsVisibleAcoesInMap] = useState(true);
  const [filtroStatusDenuncia, setFiltroStatusDenuncia] = useState<
    'todos' | StatusModel
  >('aberto');
  const [filtroStatusAcao, setFiltroStatusAcao] = useState<
    'todos' | StatusModel
  >('aberto');
  const [filtroCategoria, setFiltroCategoria] = useState<
    'todas' | Categorias | null
  >('todas');
  const [filtroSecretaria, setFiltroSecretaria] = useState<
    'todas' | Secretarias | null
  >('todas');

  const { denuncias, acoes } = useOcorrenciasContext();

  const denunciasFiltradas = useMemo(() => {
    return denuncias
      .filter(
        (d) =>
          filtroStatusDenuncia === 'todos' || d.status === filtroStatusDenuncia,
      )
      .filter(
        (d) =>
          filtroCategoria === 'todas' || d.categoria.name === filtroCategoria,
      );
  }, [denuncias, filtroStatusDenuncia, filtroCategoria]);

  const acoesFiltradas = useMemo(() => {
    return acoes
      .filter(
        (a) => filtroStatusAcao === 'todos' || a.status === filtroStatusAcao,
      )
      .filter(
        (a) =>
          filtroSecretaria === 'todas' ||
          a.secretaria.name === filtroSecretaria,
      );
  }, [acoes, filtroStatusAcao, filtroSecretaria]);

  return (
    <FiltersContext.Provider
      value={{
        isVisibleDenunciasInMap,
        isVisibleAcoesInMap,
        setIsVisibleDenunciasInMap,
        setIsVisibleAcoesInMap,
        filtroStatusDenuncia,
        setFiltroStatusDenuncia,
        filtroStatusAcao,
        setFiltroStatusAcao,
        filtroCategoria,
        setFiltroCategoria,
        filtroSecretaria,
        setFiltroSecretaria,
        denunciasFiltradas,
        acoesFiltradas,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  return useContext(FiltersContext);
}
