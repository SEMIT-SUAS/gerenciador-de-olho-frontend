import type { FilterState } from './types';

export const initialFiltersValues: FilterState = {
  isVisibleDenunciasInMap: true,
  isVisibleAcoesInMap: true,
  filtroStatusDenuncia: 'Aberto',
  filtroTipoDenuncia: '',
  filtroStatusAcao: 'Análise',
  filtroCategoria: 'todas',
  filtroSecretaria: 'todas',
  filtroDenunciasComAcao: 'desabilitado',
  filtrarAcoesPorId: 'desabilitado',
};
