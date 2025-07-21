import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useCallback,
} from 'react';
import type { StatusModel } from '../types/dadwa';
import type { Categorias } from '../types/CategoriaDenuncia';
import { useOcorrencias } from './OcorrenciasContext';
import type { Denuncia } from '../types/Denuncia';
import type { Acao } from '../types/Acao';

type FilterState = {
  isVisibleDenunciasInMap: boolean;
  isVisibleAcoesInMap: boolean;
  filtroStatusDenuncia: 'todos' | StatusModel[];
  filtroStatusAcao: 'todos' | StatusModel[];
  filtroCategoria: 'todas' | Categorias | null;
  filtroSecretaria: 'todas' | string | null;
  filtroDenunciasComAcao: 'desabilitado' | 'com_acao' | 'sem_acao';
};

type FiltersContextProps = FilterState & {
  setIsVisibleDenunciasInMap: Dispatch<SetStateAction<boolean>>;
  setIsVisibleAcoesInMap: Dispatch<SetStateAction<boolean>>;
  setFiltroStatusDenuncia: Dispatch<SetStateAction<'todos' | StatusModel[]>>;
  setFiltroStatusAcao: Dispatch<SetStateAction<'todos' | StatusModel[]>>;
  setFiltroCategoria: Dispatch<SetStateAction<'todas' | Categorias | null>>;
  setFiltroSecretaria: Dispatch<SetStateAction<'todas' | string | null>>;
  setFiltroDenunciasComAcao: Dispatch<
    SetStateAction<'desabilitado' | 'com_acao' | 'sem_acao'>
  >;
  denunciasFiltradas: Denuncia[];
  acoesFiltradas: Acao[];
  cacheCurrentFilters: () => void;
  restoreCachedFilters: () => void;
  filtrarAcoesPorId: number[] | 'desabilitado';
  setFiltrarAcoesPorId: Dispatch<SetStateAction<number[] | 'desabilitado'>>;
};

const defaultFilters: FilterState = {
  isVisibleDenunciasInMap: true,
  isVisibleAcoesInMap: true,
  filtroStatusDenuncia: ['aberto'],
  filtroStatusAcao: 'todos',
  filtroCategoria: 'todas',
  filtroSecretaria: 'todas',
  filtroDenunciasComAcao: 'desabilitado',
};

const FiltersContext = createContext({} as FiltersContextProps);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [cacheFilters, setCacheFilters] = useState<FilterState | null>(null);

  const [isVisibleDenunciasInMap, setIsVisibleDenunciasInMap] = useState(
    defaultFilters.isVisibleDenunciasInMap,
  );
  const [isVisibleAcoesInMap, setIsVisibleAcoesInMap] = useState(
    defaultFilters.isVisibleAcoesInMap,
  );
  const [filtroStatusDenuncia, setFiltroStatusDenuncia] = useState(
    defaultFilters.filtroStatusDenuncia,
  );
  const [filtroStatusAcao, setFiltroStatusAcao] = useState(
    defaultFilters.filtroStatusAcao,
  );
  const [filtroCategoria, setFiltroCategoria] = useState(
    defaultFilters.filtroCategoria,
  );
  const [filtroSecretaria, setFiltroSecretaria] = useState(
    defaultFilters.filtroSecretaria,
  );
  const [filtroDenunciasComAcao, setFiltroDenunciasComAcao] = useState(
    defaultFilters.filtroDenunciasComAcao,
  );

  const [filtrarAcoesPorId, setFiltrarAcoesPorId] = useState<
    number[] | 'desabilitado'
  >('desabilitado');

  const { denuncias, acoes } = useOcorrencias();

  const cacheCurrentFilters = useCallback(() => {
    setCacheFilters({
      isVisibleDenunciasInMap,
      isVisibleAcoesInMap,
      filtroStatusDenuncia,
      filtroStatusAcao,
      filtroCategoria,
      filtroSecretaria,
      filtroDenunciasComAcao,
    });
  }, [
    isVisibleDenunciasInMap,
    isVisibleAcoesInMap,
    filtroStatusDenuncia,
    filtroStatusAcao,
    filtroCategoria,
    filtroSecretaria,
    filtroDenunciasComAcao,
  ]);

  const restoreCachedFilters = useCallback(() => {
    const filtersToRestore = cacheFilters || defaultFilters;

    setIsVisibleDenunciasInMap(filtersToRestore.isVisibleDenunciasInMap);
    setIsVisibleAcoesInMap(filtersToRestore.isVisibleAcoesInMap);
    setFiltroStatusDenuncia(filtersToRestore.filtroStatusDenuncia);
    setFiltroStatusAcao(filtersToRestore.filtroStatusAcao);
    setFiltroCategoria(filtersToRestore.filtroCategoria);
    setFiltroSecretaria(filtersToRestore.filtroSecretaria);
    setFiltroDenunciasComAcao(filtersToRestore.filtroDenunciasComAcao);

    if (cacheFilters) {
      setCacheFilters(null);
    }
  }, [cacheFilters]);

  const denunciasFiltradas = useMemo(() => {
    return denuncias.filter((d) => {
      const passaStatus =
        filtroStatusDenuncia === 'todos' ||
        filtroStatusDenuncia.includes(d.status);

      const passaCategoria =
        filtroCategoria === 'todas' || d.categoria === filtroCategoria;

      const passaFiltroAcao =
        filtroDenunciasComAcao === 'desabilitado' ||
        (filtroDenunciasComAcao === 'com_acao' && d.acaoId) ||
        (filtroDenunciasComAcao === 'sem_acao' && !d.acaoId);

      return passaStatus && passaCategoria && passaFiltroAcao;
    });
  }, [
    denuncias,
    filtroStatusDenuncia,
    filtroCategoria,
    filtroDenunciasComAcao,
  ]);

  const acoesFiltradas = useMemo(() => {
    if (filtrarAcoesPorId != 'desabilitado') {
      return acoes.filter((a) => filtrarAcoesPorId.includes(a.id));
    }

    return acoes.filter((a) => {
      const passaStatus =
        filtroStatusAcao === 'todos' || filtroStatusAcao.includes(a.status);

      const passaSecretaria =
        filtroSecretaria === 'todas' || a.secretaria.nome === filtroSecretaria;

      return passaStatus && passaSecretaria;
    });
  }, [acoes, filtroStatusAcao, filtroSecretaria, filtrarAcoesPorId]);

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
        filtroDenunciasComAcao,
        setFiltroDenunciasComAcao,
        cacheCurrentFilters,
        restoreCachedFilters,
        filtrarAcoesPorId,
        setFiltrarAcoesPorId,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  return useContext(FiltersContext);
}
