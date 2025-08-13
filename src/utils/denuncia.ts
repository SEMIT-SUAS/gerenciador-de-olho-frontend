import type { DenunciaModel, DenunciaStatusModelTypes } from '@/types/Denuncia';

export function getDenunciaStatus(
  denuncia: DenunciaModel,
): DenunciaStatusModelTypes {
  if (!denuncia.dadosAcaoParaDenuncia) return 'Aberto';

  return denuncia.dadosAcaoParaDenuncia.status as DenunciaStatusModelTypes;
}
