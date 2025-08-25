import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import type {
  DenunciaInMap,
  DenunciaStatusModelTypes,
} from '../types/Denuncia';
import type { AcaoInMap, AcaoModel } from '../types/Acao';
import type { AcaoStatusModelTypes } from '../types/AcaoStatus';
import type { TipoDenunciaModel } from '@/types/TipoDenuncia';
import { useMapActions } from './MapActions';
import { DADOS_BAIRROS } from '@/constants/dadosDeBairros';
import { useAuth } from './AuthContext';
import { DenunciaService } from '@/services/DenunciaService';
import AcoesService from '@/services/acoesService';

type FilterState = {
  isVisibleDenunciasInMap: boolean;
  isVisibleAcoesInMap: boolean;
  filtroStatusDenuncia: string | DenunciaStatusModelTypes | null;
  filtroStatusAcao: string | AcaoStatusModelTypes;
  filtroCategoria: 'todas' | string | null;
  filtroSecretaria: 'todas' | string | null;
  filtroDenunciasComAcao: 'desabilitado' | 'com_acao' | 'sem_acao';
  filtrarAcoesPorId: number[] | 'desabilitado';
  filtroTipoDenuncia: TipoDenunciaModel | string | null;
};

type FiltersContextProps = FilterState & {
  setIsVisibleDenunciasInMap: Dispatch<SetStateAction<boolean>>;
  setIsVisibleAcoesInMap: Dispatch<SetStateAction<boolean>>;
  setFiltroStatusDenuncia: Dispatch<
    SetStateAction<DenunciaStatusModelTypes | string | null>
  >;
  setFiltroStatusAcao: Dispatch<SetStateAction<AcaoStatusModelTypes | string>>;
  setFiltroCategoria: Dispatch<SetStateAction<'todas' | string | null>>;
  setFiltroSecretaria: Dispatch<SetStateAction<'todas' | string | null>>;

  setFiltroDenunciasComAcao: Dispatch<
    SetStateAction<'desabilitado' | 'com_acao' | 'sem_acao'>
  >;

  setFiltrarTipoDenuncia: Dispatch<
    SetStateAction<TipoDenunciaModel | string | null>
  >;
  acoesDoBairro: AcaoInMap[];
  setAcoesDoBairro: Dispatch<SetStateAction<AcaoInMap[]>>;
  denunciasDoBairro: DenunciaInMap[];
  setDenunciasDoBairro: Dispatch<SetStateAction<DenunciaInMap[]>>;
  filtroStatusDenuncia: DenunciaStatusModelTypes | string | null;
  updateAcao: (acaoAtualizada: AcaoModel) => void;
  filtrarAcoesPorId: number[] | 'desabilitado';
  setFiltrarAcoesPorId: Dispatch<SetStateAction<number[] | 'desabilitado'>>;
  fetchDataFiltrada: () => Promise<void>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
};

const defaultFilters: FilterState = {
  isVisibleDenunciasInMap: true,
  isVisibleAcoesInMap: true,
  filtroStatusDenuncia: 'Aberto',
  filtroTipoDenuncia: null,
  filtroStatusAcao: 'Análise',
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [acoesDoBairro, setAcoesDoBairro] = useState<AcaoInMap[]>([]);

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

  const [filtroTipoDenuncia, setFiltrarTipoDenuncia] = useState(
    defaultFilters.filtroTipoDenuncia,
  );

  const [filtrarAcoesPorId, setFiltrarAcoesPorId] = useState<
    number[] | 'desabilitado'
  >('desabilitado');

  const updateAcao = (acaoAtualizada: AcaoModel) => {
    setAcoesDoBairro((prevAcoes) =>
      prevAcoes.map(
        (acao) =>
          acao.id === acaoAtualizada.id
            ? acaoAtualizada // ...substitui pela ação atualizada.
            : acao, // ...senão, mantém a ação como estava.
      ),
    );
  };

  const fetchDataFiltrada = useCallback(async () => {
    if (!currentBairroId) {
      setDenunciasDoBairro([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const denunciaParams = {
        bairro: DADOS_BAIRROS.find((b) => b.id === currentBairroId)!.nome,
        status: filtroStatusDenuncia,
        secretaria: user!.idSecretaria,
        'tipo-denuncia': filtroTipoDenuncia,
      };
      const acaoParams = {
        bairro: DADOS_BAIRROS.find((b) => b.id === currentBairroId)!.nome,
        // Lembre-se de usar a variável correta que corrigimos antes
        status: filtroStatusAcao,
        secretaria: user!.idSecretaria,
      };
      if (isVisibleDenunciasInMap) {
        const denuncias = await DenunciaService.getDenunciaPorBairro(
          denunciaParams,
        );
        setDenunciasDoBairro(denuncias);
      }
      if (isVisibleAcoesInMap) {
        const acoes = await AcoesService.getFilteredAcoes(acaoParams);
        setAcoesDoBairro(acoes);
      }
    } catch (err) {
      console.error('Falha ao buscar denúncias:', err);
    } finally {
      setLoading(false);
    }
    // 3. Adicionar todas as dependências que a função usa
  }, [
    currentBairroId,
    filtroStatusDenuncia,
    user,
    filtroTipoDenuncia,
    filtroStatusAcao,
    isVisibleDenunciasInMap,
    isVisibleAcoesInMap,
  ]);

  useEffect(() => {
    fetchDataFiltrada();
  }, [currentBairroId, fetchDataFiltrada]); // Agora fetchDataFiltrada é estável

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
        setDenunciasDoBairro,
        acoesDoBairro,
        setAcoesDoBairro,
        filtroDenunciasComAcao,
        setFiltroDenunciasComAcao,
        filtrarAcoesPorId,
        setFiltrarAcoesPorId,
        filtroTipoDenuncia,
        setFiltrarTipoDenuncia,
        updateAcao,
        fetchDataFiltrada,
        loading,
        error,
        setLoading,
        setError,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  return useContext(FiltersContext);
}
