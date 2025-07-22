import type { AcaoStatusModelTypes } from '../types/AcaoStatus';
import type { DenunciaModel } from '../types/Denuncia';

export function getDenunciaStatus(
  denuncia: DenunciaModel,
): 'aberto' | AcaoStatusModelTypes {
  if (denuncia.acao == null) {
    return 'aberto';
  }

  if (denuncia.denunciaIndeferida) {
    return 'indeferido';
  }

  return denuncia.acao.status[0].status;
}
