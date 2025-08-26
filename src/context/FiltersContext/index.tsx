import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { DenunciaInMap, DenunciaStatusModelTypes } from '@/types/Denuncia';
import type { AcaoInMap } from '@/types/Acao';
import { useMapActions } from '@/context/MapActions';
import { DADOS_BAIRROS } from '@/constants/dadosDeBairros';
import { useAuth } from '@/context/AuthContext';
import { DenunciaService } from '@/services/DenunciaService';
import AcoesService from '@/services/acoesService';
import { initialFiltersValues } from './initialFilterValues';
import type { FiltersContextProps, FiltrarDataPrams } from './types';
import { toast } from 'sonner';
import type { AcaoStatusModelTypes } from '@/types/AcaoStatus';

const FiltersContext = createContext({} as FiltersContextProps);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const { currentBairroId } = useMapActions();
  const { user } = useAuth();

  const [denunciasDoBairro, setDenunciasDoBairro] = useState<DenunciaInMap[]>(
    [],
  );
  const [acoesDoBairro, setAcoesDoBairro] = useState<AcaoInMap[]>([]);

  const [isVisibleDenunciasInMap, setIsVisibleDenunciasInMap] = useState(
    initialFiltersValues.isVisibleDenunciasInMap,
  );
  const [isVisibleAcoesInMap, setIsVisibleAcoesInMap] = useState(
    initialFiltersValues.isVisibleAcoesInMap,
  );
  const [filtroStatusDenuncia, setFiltroStatusDenuncia] = useState(
    initialFiltersValues.filtroStatusDenuncia,
  );
  const [filtroStatusAcao, setFiltroStatusAcao] = useState(
    initialFiltersValues.filtroStatusAcao,
  );
  const [filtroCategoria, setFiltroCategoria] = useState(
    initialFiltersValues.filtroCategoria,
  );
  const [filtroSecretaria, setFiltroSecretaria] = useState(
    initialFiltersValues.filtroSecretaria,
  );
  const [filtroDenunciasComAcao, setFiltroDenunciasComAcao] = useState(
    initialFiltersValues.filtroDenunciasComAcao,
  );

  const [filtroTipoDenuncia, setFiltrarTipoDenuncia] = useState(
    initialFiltersValues.filtroTipoDenuncia,
  );

  const [filtrarAcoesPorId, setFiltrarAcoesPorId] = useState<
    number[] | 'desabilitado'
  >('desabilitado');

  const [isDisabledFiltersInMap, setIsDisabledFiltersInMap] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  async function filtrarData({
    denunciaStatusParam,
    acaoStatusParam,
    tipoDaDenunciaParam,
  }: FiltrarDataPrams) {
    if (!currentBairroId) return;

    try {
      setIsLoading(true);

      if (denunciaStatusParam) {
        setIsVisibleDenunciasInMap(true);
        setFiltroStatusDenuncia(denunciaStatusParam);
      } else {
        setIsVisibleDenunciasInMap(false);
      }

      if (acaoStatusParam) {
        setIsVisibleAcoesInMap(true);
        setFiltroStatusAcao(acaoStatusParam);
      } else {
        setIsVisibleAcoesInMap(false);
      }

      setFiltrarTipoDenuncia(tipoDaDenunciaParam);

      const denunciaParams = {
        bairro: DADOS_BAIRROS.find((b) => b.id === currentBairroId)!.nome,
        status: denunciaStatusParam,
        secretaria: user!.idSecretaria,
        'tipo-denuncia': tipoDaDenunciaParam,
      };

      const acaoParams = {
        bairro: DADOS_BAIRROS.find((b) => b.id === currentBairroId)!.nome,
        status: acaoStatusParam,
        secretaria: user!.idSecretaria,
      };

      if (isVisibleDenunciasInMap) {
        const denuncias = await DenunciaService.getDenunciaPorBairro(
          denunciaParams,
        );

        setDenunciasDoBairro(denuncias);
      }

      if (acaoStatusParam) {
        const acoes = await AcoesService.getFilteredAcoes(acaoParams);
        setAcoesDoBairro(acoes);
      }

      setIsLoading(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    filtrarData({
      acaoStatusParam:
        filtroStatusDenuncia === 'Aberto' ? null : filtroStatusDenuncia,
      denunciaStatusParam: filtroStatusDenuncia,
      tipoDaDenunciaParam: filtroTipoDenuncia,
    });
  }, [currentBairroId]);

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
        isDisabledFiltersInMap,
        setIsDisabledFiltersInMap,
        filtrarData,
        isLoading,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  return useContext(FiltersContext);
}
