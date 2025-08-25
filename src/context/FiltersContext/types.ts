import type { AcaoInMap } from '@/types/Acao';
import type { AcaoStatusModelTypes } from '@/types/AcaoStatus';
import type { DenunciaInMap, DenunciaStatusModelTypes } from '@/types/Denuncia';
import type { TipoDenunciaModel } from '@/types/TipoDenuncia';
import type { Dispatch, SetStateAction } from 'react';

export type FilterState = {
  isVisibleDenunciasInMap: boolean;
  isVisibleAcoesInMap: boolean;
  filtroStatusDenuncia: DenunciaStatusModelTypes;
  filtroStatusAcao: string | AcaoStatusModelTypes;
  filtroCategoria: 'todas' | string | null;
  filtroSecretaria: 'todas' | string | null;
  filtroDenunciasComAcao: 'desabilitado' | 'com_acao' | 'sem_acao';
  filtrarAcoesPorId: number[] | 'desabilitado';
  filtroTipoDenuncia: string | null;
};

export type FiltersContextProps = FilterState & {
  setIsVisibleDenunciasInMap: Dispatch<SetStateAction<boolean>>;
  setIsVisibleAcoesInMap: Dispatch<SetStateAction<boolean>>;
  setFiltroStatusDenuncia: Dispatch<SetStateAction<DenunciaStatusModelTypes>>;
  setFiltroStatusAcao: Dispatch<SetStateAction<AcaoStatusModelTypes | string>>;
  setFiltroCategoria: Dispatch<SetStateAction<'todas' | string | null>>;
  setFiltroSecretaria: Dispatch<SetStateAction<'todas' | string | null>>;

  setFiltroDenunciasComAcao: Dispatch<
    SetStateAction<'desabilitado' | 'com_acao' | 'sem_acao'>
  >;

  setFiltrarTipoDenuncia: Dispatch<SetStateAction<string | null>>;
  acoesDoBairro: AcaoInMap[];
  setAcoesDoBairro: Dispatch<SetStateAction<AcaoInMap[]>>;
  denunciasDoBairro: DenunciaInMap[];
  setDenunciasDoBairro: Dispatch<SetStateAction<DenunciaInMap[]>>;
  filtroStatusDenuncia: DenunciaStatusModelTypes | string | null;
  filtrarAcoesPorId: number[] | 'desabilitado';
  setFiltrarAcoesPorId: Dispatch<SetStateAction<number[] | 'desabilitado'>>;
  filtrarData: () => Promise<void>;
  isLoading: boolean;
};
