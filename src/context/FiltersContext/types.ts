import type { AcaoModel } from '@/types/Acao';
import type { AcaoStatusModelTypes } from '@/types/AcaoStatus';
import type {
  DenunciaBasicInfoModel,
  DenunciaStatusModelTypes,
} from '@/types/Denuncia';
import type { Dispatch, SetStateAction } from 'react';

export type FilterState = {
  isVisibleDenunciasInMap: boolean;
  isVisibleAcoesInMap: boolean;
  filtroStatusDenuncia: 'all' | DenunciaStatusModelTypes[];
  filtroStatusAcao: 'all' | AcaoStatusModelTypes[];
  filtroCategoriaTipo: 'all' | string;
  filtroSecretaria: 'all' | string;
  filtroDenunciasComAcao: 'disabled' | 'com_acao' | 'sem_acao';
  filtrarAcoesPorId: number[] | 'disabled';
};

export type FiltersContextProps = FilterState & {
  setIsVisibleDenunciasInMap: Dispatch<SetStateAction<boolean>>;
  setIsVisibleAcoesInMap: Dispatch<SetStateAction<boolean>>;
  setFiltroStatusDenuncia: Dispatch<
    SetStateAction<'all' | DenunciaStatusModelTypes[]>
  >;
  setFiltroStatusAcao: Dispatch<SetStateAction<'all' | AcaoStatusModelTypes[]>>;
  setFiltroCategoriaTipo: Dispatch<SetStateAction<'all' | string>>;
  setFiltroSecretaria: Dispatch<SetStateAction<'all' | string>>;
  setFiltroDenunciasComAcao: Dispatch<
    SetStateAction<'disabled' | 'com_acao' | 'sem_acao'>
  >;
  denunciasFiltradas: DenunciaBasicInfoModel[];
  acoesFiltradas: AcaoModel[];
  cacheCurrentFilters: () => void;
  restoreCachedFilters: () => void;
  setFiltrarAcoesPorId: Dispatch<SetStateAction<number[] | 'disabled'>>;
};
