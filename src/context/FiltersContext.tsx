import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useEffect,
} from 'react';
import { useOcorrencias } from './OcorrenciasContext';
import type {
  DenunciaInMap,
  DenunciaModel,
  DenunciaStatusModelTypes,
} from '../types/Denuncia';
import type { AcaoModel } from '../types/Acao';
import type { AcaoStatusModelTypes } from '../types/AcaoStatus';
import { getDenunciaStatus } from '../utils/getDenunciaStatus';
import type { TipoDenunciaModel } from '@/types/TipoDenuncia';
import { useMapActions } from './MapActions';
import { DADOS_BAIRROS } from '@/constants/dadosDeBairros';
import { useAuth } from './AuthContext';
import { DenunciaService } from '@/services/DenunciaService';

type FilterState = {
  isVisibleDenunciasInMap: boolean;
  isVisibleAcoesInMap: boolean;
  filtroStatusDenuncia: DenunciaStatusModelTypes;
  filtroStatusAcao: 'todos' | AcaoStatusModelTypes[];
  filtroCategoria: 'todas' | string | null;
  filtroSecretaria: 'todas' | string | null;
  filtroDenunciasComAcao: 'desabilitado' | 'com_acao' | 'sem_acao';
  filtrarAcoesPorId: number[] | 'desabilitado';
  filtroTipoDenuncia: TipoDenunciaModel | '';
};

type FiltersContextProps = FilterState & {
  setIsVisibleDenunciasInMap: Dispatch<SetStateAction<boolean>>;
  setIsVisibleAcoesInMap: Dispatch<SetStateAction<boolean>>;
  setFiltroStatusDenuncia: Dispatch<SetStateAction<DenunciaStatusModelTypes>>;
  setFiltroStatusAcao: Dispatch<
    SetStateAction<'todos' | AcaoStatusModelTypes[]>
  >;
  setFiltroCategoria: Dispatch<SetStateAction<'todas' | string | null>>;
  setFiltroSecretaria: Dispatch<SetStateAction<'todas' | string | null>>;

  setFiltroDenunciasComAcao: Dispatch<
    SetStateAction<'desabilitado' | 'com_acao' | 'sem_acao'>
  >;

  setFiltrorTipoDenuncia: Dispatch<
    SetStateAction<'Aberto' | TipoDenunciaModel[]>
  >;
  denunciasDoBairro: DenunciaInMap[];
  // denunciasFiltradas: DenunciaModel[];
  filtroStatusDenuncia: DenunciaStatusModelTypes;
  acoesFiltradas: AcaoModel[];
  // cacheCurrentFilters: () => void;
  // restoreCachedFilters: () => void;
  filtrarAcoesPorId: number[] | 'desabilitado';
  setFiltrarAcoesPorId: Dispatch<SetStateAction<number[] | 'desabilitado'>>;
};

const defaultFilters: FilterState = {
  isVisibleDenunciasInMap: true,
  isVisibleAcoesInMap: true,
  filtroStatusDenuncia: 'Aberto',
  filtrarTipoDenuncia: '',
  filtroStatusAcao: 'todos',
  filtroCategoria: 'todas',
  filtroSecretaria: 'todas',
  filtroDenunciasComAcao: 'desabilitado',
  filtrarAcoesPorId: 'desabilitado',
};

const FiltersContext = createContext({} as FiltersContextProps);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const { currentBairroId } = useMapActions();
  const { user } = useAuth();

  const [denunciasDoBairro, setDenunciasDoBairro] = useState<DenunciaInMap[]>(
    [],
  );

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

  const [filtroTipoDenuncia, setFiltrorTipoDenuncia] = useState(
    defaultFilters.filtroTipoDenuncia,
  );

  const [filtrarAcoesPorId, setFiltrarAcoesPorId] = useState<
    number[] | 'desabilitado'
  >('desabilitado');

  // const {} = useOcorrencias();
  const denuncias = [];
  const acoes = [];

  // const cacheCurrentFilters = useCallback(() => {
  //   setCacheFilters({
  //     isVisibleDenunciasInMap,
  //     isVisibleAcoesInMap,
  //     filtroStatusDenuncia,
  //     filtroStatusAcao,
  //     filtroCategoria,
  //     filtroSecretaria,
  //     filtroDenunciasComAcao,
  //     filtrarAcoesPorId,
  //     filtroTipoDenuncia,
  //   });
  // }, [
  //   isVisibleDenunciasInMap,
  //   isVisibleAcoesInMap,
  //   filtroStatusDenuncia,
  //   filtroStatusAcao,
  //   filtroCategoria,
  //   filtroSecretaria,
  //   filtroDenunciasComAcao,
  //   filtrarAcoesPorId,
  //   filtroTipoDenuncia,
  // ]);

  // const restoreCachedFilters = useCallback(() => {
  //   const filtersToRestore = cacheFilters || defaultFilters;

  //   setIsVisibleDenunciasInMap(filtersToRestore.isVisibleDenunciasInMap);
  //   setIsVisibleAcoesInMap(filtersToRestore.isVisibleAcoesInMap);
  //   setFiltroStatusDenuncia(filtersToRestore.filtroStatusDenuncia);
  //   setFiltroStatusAcao(filtersToRestore.filtroStatusAcao);
  //   setFiltroCategoria(filtersToRestore.filtroCategoria);
  //   setFiltroSecretaria(filtersToRestore.filtroSecretaria);
  //   setFiltroDenunciasComAcao(filtersToRestore.filtroDenunciasComAcao);
  //   setFiltrarAcoesPorId(filtersToRestore.filtrarAcoesPorId);
  //   setFiltrorTipoDenuncia(filtersToRestore.filtroTipoDenuncia);

  //   if (cacheFilters) {
  //     setCacheFilters(null);
  //   }
  // }, [cacheFilters]);

  // const denunciasFiltradas = useMemo(() => {
  //   return denuncias.filter((d) => {
  //     const denunciaStatus = getDenunciaStatus(d);

  //     // console.log(denunciaStatus);

  //     const passaStatus =
  //       filtroStatusDenuncia === 'todos' ||
  //       filtroStatusDenuncia.includes(denunciaStatus);

  //     const passaCategoria =
  //       filtroCategoria === 'todas' ||
  //       d.tipo?.categoria?.nome === filtroCategoria;

  //     const passaFiltroAcao =
  //       filtroDenunciasComAcao === 'desabilitado' ||
  //       (filtroDenunciasComAcao === 'com_acao' && d.acao) ||
  //       (filtroDenunciasComAcao === 'sem_acao' && !d.acao);

  //     return passaStatus && passaCategoria && passaFiltroAcao;
  //   });
  // }, [
  //   denuncias,
  //   filtroStatusDenuncia,
  //   filtroCategoria,
  //   filtroDenunciasComAcao,
  //   acoes,
  // ]);

  useEffect(() => {
    const fetchDenunciasFiltradas = async () => {
      if (!currentBairroId) {
        setDenunciasDoBairro([]);
        return;
      }

      // setIsLoading(true);
      // setError(null);

      try {
        const params = {
          bairro: DADOS_BAIRROS.find((b) => b.id === currentBairroId)!.nome,

          status: filtroStatusDenuncia,

          secretaria: user!.idSecretaria,

          tipoDenuncia: filtroTipoDenuncia,
        };
        console.log(params.bairro);
        console.log(params.status);
        console.log(params.secretaria);
        console.log(params.tipoDenuncia);

        const denuncias = await DenunciaService.getDenunciaPorBairro(params);
        setDenunciasDoBairro(denuncias);
      } catch (err) {
        console.error('Falha ao buscar denúncias:', err);
      } finally {
        // setIsLoading(false);
      }
    };

    fetchDenunciasFiltradas();
  }, [
    currentBairroId,
    filtroStatusDenuncia,
    filtroSecretaria,
    filtroTipoDenuncia,
  ]);

  console.log('Denuncias do bairro:', denunciasDoBairro);

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
  console.log(filtroStatusDenuncia);
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
        denunciasDoBairro,
        // denunciasFiltradas,
        acoesFiltradas,
        filtroDenunciasComAcao,
        setFiltroDenunciasComAcao,
        // cacheCurrentFilters,
        // restoreCachedFilters,
        filtrarAcoesPorId,
        setFiltrarAcoesPorId,
        filtroTipoDenuncia,
        //
        setFiltrorTipoDenuncia,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  return useContext(FiltersContext);
}
