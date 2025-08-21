import type { DenunciaModel, DenunciaStatusModelTypes } from '@/types/Denuncia';

export function getDenunciaStatus(
  denuncia: DenunciaModel,
): DenunciaStatusModelTypes {
  if (denuncia.denunciaIndeferida) {
    return 'Indeferido';
  }

  if (denuncia.dadosAcaoParaDenuncia) {
    return denuncia.dadosAcaoParaDenuncia.status;
  }

  return 'Aberto';
}
