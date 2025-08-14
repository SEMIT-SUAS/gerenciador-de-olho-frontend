import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
  useCallback,
} from 'react';
import { useOcorrencias } from '../OcorrenciasContext';
import type { FiltersContextProps, FilterState } from './types';

const defaultFilters: FilterState = {
  isVisibleDenunciasInMap: true,
  isVisibleAcoesInMap: true,
  filtroStatusDenuncia: ['Aberto'],
  filtroStatusAcao: 'all',
  filtroCategoriaTipo: 'all',
  filtroSecretaria: 'all',
  filtroDenunciasComAcao: 'disabled',
  filtrarAcoesPorId: 'disabled',
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
    number[] | 'disabled'
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
      let denunciaStatus = d.status;

      if (!denunciaStatus) {
        denunciaStatus = 'Aberto';
      }

      const passaStatus =
        filtroStatusDenuncia === 'all'
          ? true
          : filtroStatusDenuncia.includes(denunciaStatus);

      const passaCategoriaTpo =
        filtroCategoriaTipo === 'all'
          ? true
          : d.nomeTipoDenuncia === filtroCategoriaTipo;

      return passaStatus && passaCategoriaTpo;
    });
  }, [denuncias, filtroStatusDenuncia, filtroCategoriaTipo]);

  const acoesFiltradas = useMemo(() => {
    return acoes.filter((acao) => {
      const passaStatus =
        filtroStatusAcao === 'all'
          ? true
          : filtroStatusAcao.includes(acao.status);

      const passaSecretaria =
        filtroSecretaria === 'all'
          ? true
          : acao.siglaSecretaria === filtroSecretaria;

      return passaStatus && passaSecretaria;
    });
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
