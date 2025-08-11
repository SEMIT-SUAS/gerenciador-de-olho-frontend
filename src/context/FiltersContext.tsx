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
import type {
  DenunciaModel,
  DenunciaStatusModelTypes,
} from '../types/Denuncia';
import type { AcaoModel } from '../types/Acao';
import type { AcaoStatusModelTypes } from '../types/AcaoStatus';
import { getDenunciaStatus } from '../utils/getDenunciaStatus';

type FilterState = {
  isVisibleDenunciasInMap: boolean;
  isVisibleAcoesInMap: boolean;
  filtroStatusDenuncia: 'todos' | DenunciaStatusModelTypes[];
  filtroStatusAcao: 'todos' | AcaoStatusModelTypes[];
  filtroCategoria: 'todas' | string | null;
  filtroSecretaria: 'todas' | string | null;
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
  setFiltroCategoria: Dispatch<SetStateAction<'todas' | string | null>>;
  setFiltroSecretaria: Dispatch<SetStateAction<'todas' | string | null>>;

  setFiltroDenunciasComAcao: Dispatch<
    SetStateAction<'desabilitado' | 'com_acao' | 'sem_acao'>
  >;
  denunciasFiltradas: DenunciaModel[];
  acoesFiltradas: AcaoModel[];
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
      filtrarAcoesPorId,
    });
  }, [
    isVisibleDenunciasInMap,
    isVisibleAcoesInMap,
    filtroStatusDenuncia,
    filtroStatusAcao,
    filtroCategoria,
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
    setFiltroCategoria(filtersToRestore.filtroCategoria);
    setFiltroSecretaria(filtersToRestore.filtroSecretaria);
    setFiltroDenunciasComAcao(filtersToRestore.filtroDenunciasComAcao);
    setFiltrarAcoesPorId(filtersToRestore.filtrarAcoesPorId);

    if (cacheFilters) {
      setCacheFilters(null);
    }
  }, [cacheFilters]);

  const denunciasFiltradas = useMemo(() => {
    // return denuncias.filter((d) => {
    //   const denunciaStatus = getDenunciaStatus(d);

    //   // console.log(denunciaStatus);

    //   const passaStatus =
    //     filtroStatusDenuncia === 'todos' ||
    //     filtroStatusDenuncia.includes(denunciaStatus);

    //   const passaCategoria =
    //     filtroCategoria === 'todas' ||
    //     d.tipo?.categoria?.nome === filtroCategoria;

    //   const passaFiltroAcao =
    //     filtroDenunciasComAcao === 'desabilitado' ||
    //     (filtroDenunciasComAcao === 'com_acao' && d.acao) ||
    //     (filtroDenunciasComAcao === 'sem_acao' && !d.acao);

    //   return passaStatus && passaCategoria && passaFiltroAcao;
    // });
    console.log(denuncias);
    return denuncias;
  }, [
    denuncias,
    filtroStatusDenuncia,
    filtroCategoria,
    filtroDenunciasComAcao,
    acoes,
  ]);

  const acoesFiltradas = useMemo(() => {
    if (filtrarAcoesPorId !== 'desabilitado') {
      return acoes.filter((a) => filtrarAcoesPorId.includes(a.id));
    }

    return acoes
      .filter((a) => {
        console.log(filtroSecretaria);
        if (filtroSecretaria === 'todas') {
          return a;
        } else {
          console.log(a.secretaria.sigla);
          return a.secretaria.sigla === filtroSecretaria;
        }
      })
      .filter((a) => {
        const currentStatus = a.status?.[a.status.length - 1]?.status;
        if (!currentStatus) return false;

        if (filtroStatusAcao === 'todos') {
          return a;
        } else {
          return filtroStatusAcao[0] === currentStatus;
        }
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
