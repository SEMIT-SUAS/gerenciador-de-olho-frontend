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
import { useOcorrencias } from './OcorrenciasContext';
import type { DenunciaStatusModelTypes } from '../types/Denuncia';
import type { AcaoModel } from '../types/Acao';
import type { AcaoStatusModelTypes } from '../types/AcaoStatus';
import type { DenunciaBasicInfoModel } from '../types/Denuncia';

type FilterState = {
  isVisibleDenunciasInMap: boolean;
  isVisibleAcoesInMap: boolean;
  filtroStatusDenuncia: 'todos' | DenunciaStatusModelTypes[];
  filtroStatusAcao: 'todos' | AcaoStatusModelTypes[];
  filtroCategoriaTipo: 'todos' | string;
  filtroSecretaria: 'todas' | string;
  filtroDenunciasComAcao: 'desabilitado' | 'com_acao' | 'sem_acao';
  filtrarAcoesPorId: number[] | 'desabilitado';
};

type FiltersContextProps = FilterState & {
  setIsVisibleDenunciasInMap: Dispatch<SetStateAction<boolean>>;
  setIsVisibleAcoesInMap: Dispatch<SetStateAction<boolean>>;
  setFiltroStatusDenuncia: Dispatch<
    SetStateAction<'todos' | DenunciaStatusModelTypes[]>
  >;
  setFiltroStatusAcao: Dispatch<
    SetStateAction<'todos' | AcaoStatusModelTypes[]>
  >;
  setFiltroCategoriaTipo: Dispatch<SetStateAction<'todos' | string>>;
  setFiltroSecretaria: Dispatch<SetStateAction<'todas' | string>>;
  setFiltroDenunciasComAcao: Dispatch<
    SetStateAction<'desabilitado' | 'com_acao' | 'sem_acao'>
  >;
  denunciasFiltradas: DenunciaBasicInfoModel[];
  acoesFiltradas: AcaoModel[];
  cacheCurrentFilters: () => void;
  restoreCachedFilters: () => void;
  setFiltrarAcoesPorId: Dispatch<SetStateAction<number[] | 'desabilitado'>>;
};

const defaultFilters: FilterState = {
  isVisibleDenunciasInMap: true,
  isVisibleAcoesInMap: true,
  filtroStatusDenuncia: ['aberto'],
  filtroStatusAcao: 'todos',
  filtroCategoriaTipo: 'todos',
  filtroSecretaria: 'todas',
  filtroDenunciasComAcao: 'desabilitado',
  filtrarAcoesPorId: 'desabilitado',
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
  const [filtroCategoriaTipo, setFiltroCategoriaTipo] = useState(
    defaultFilters.filtroCategoriaTipo,
  );
  const [filtroSecretaria, setFiltroSecretaria] = useState(
    defaultFilters.filtroSecretaria,
  );
  const [filtroDenunciasComAcao, setFiltroDenunciasComAcao] = useState(
    defaultFilters.filtroDenunciasComAcao,
  );
  const [filtrarAcoesPorId, setFiltrarAcoesPorId] = useState<
    number[] | 'desabilitado'
  >(defaultFilters.filtrarAcoesPorId);

  const { denuncias, acoes } = useOcorrencias();

  const cacheCurrentFilters = useCallback(() => {
    setCacheFilters({
      isVisibleDenunciasInMap,
      isVisibleAcoesInMap,
      filtroStatusDenuncia,
      filtroStatusAcao,
      filtroCategoriaTipo,
      filtroSecretaria,
      filtroDenunciasComAcao,
      filtrarAcoesPorId,
    });
  }, [
    isVisibleDenunciasInMap,
    isVisibleAcoesInMap,
    filtroStatusDenuncia,
    filtroStatusAcao,
    filtroCategoriaTipo,
    filtroSecretaria,
    filtroDenunciasComAcao,
    filtrarAcoesPorId,
  ]);

  const restoreCachedFilters = useCallback(() => {
    const filtersToRestore = cacheFilters || defaultFilters;

    setIsVisibleDenunciasInMap(filtersToRestore.isVisibleDenunciasInMap);
    setIsVisibleAcoesInMap(filtersToRestore.isVisibleAcoesInMap);
    setFiltroStatusDenuncia(filtersToRestore.filtroStatusDenuncia);
    setFiltroStatusAcao(filtersToRestore.filtroStatusAcao);
    setFiltroCategoriaTipo(filtersToRestore.filtroCategoriaTipo);
    setFiltroSecretaria(filtersToRestore.filtroSecretaria);
    setFiltroDenunciasComAcao(filtersToRestore.filtroDenunciasComAcao);
    setFiltrarAcoesPorId(filtersToRestore.filtrarAcoesPorId);

    if (cacheFilters) {
      setCacheFilters(null);
    }
  }, [cacheFilters]);

  const denunciasFiltradas = useMemo(() => {
    return denuncias.filter((d) => {
      const passaStatus = true;

      const passaCategoria =
        filtroCategoriaTipo === 'todos' ||
        d.nomeTipoDenuncia === filtroCategoriaTipo;

      const passaFiltroAcao =
        filtroDenunciasComAcao === 'desabilitado' ||
        (filtroDenunciasComAcao === 'com_acao' && d.idAcao !== null) ||
        (filtroDenunciasComAcao === 'sem_acao' && d.idAcao === null);

      return passaStatus && passaCategoria && passaFiltroAcao;
    });
  }, [denuncias, filtroCategoriaTipo, filtroDenunciasComAcao]);

  const acoesFiltradas = useMemo(() => {
    let acoesTemp = acoes;

    if (filtrarAcoesPorId !== 'desabilitado') {
      return acoesTemp.filter((a) => filtrarAcoesPorId.includes(a.id));
    }

    if (filtroSecretaria !== 'todas') {
      acoesTemp = acoesTemp.filter(
        (a) => a.secretaria.sigla === filtroSecretaria,
      );
    }

    if (filtroStatusAcao !== 'todos') {
      acoesTemp = acoesTemp.filter((a) => {
        const currentStatus = a.status?.[a.status.length - 1]?.status;
        return currentStatus ? filtroStatusAcao.includes(currentStatus) : false;
      });
    }

    return acoesTemp;
  }, [acoes, filtroStatusAcao, filtroSecretaria, filtrarAcoesPorId]);

  return (
    <FiltersContext.Provider
      value={{
        isVisibleDenunciasInMap,
        isVisibleAcoesInMap,
        filtroStatusDenuncia,
        filtroStatusAcao,
        filtroCategoriaTipo,
        filtroSecretaria,
        filtroDenunciasComAcao,
        filtrarAcoesPorId,
        denunciasFiltradas,
        acoesFiltradas,
        setIsVisibleDenunciasInMap,
        setIsVisibleAcoesInMap,
        setFiltroStatusDenuncia,
        setFiltroStatusAcao,
        setFiltroCategoriaTipo,
        setFiltroSecretaria,
        setFiltroDenunciasComAcao,
        setFiltrarAcoesPorId,
        cacheCurrentFilters,
        restoreCachedFilters,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  return useContext(FiltersContext);
}
