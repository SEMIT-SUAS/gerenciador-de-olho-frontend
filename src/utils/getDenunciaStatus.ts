import type { UsuarioModel } from '@/types/Usuario';
import type { AcaoStatusModelTypes } from '../types/AcaoStatus';
import type { DenunciaModel } from '../types/Denuncia';

export function getDenunciaStatus(
  denuncia: DenunciaModel,
): 'aberto' | AcaoStatusModelTypes {
  if (denuncia.denunciaIndeferida) {
    return 'indeferido';
  }

  if (denuncia.acao == null) {
    return 'aberto';
  }

  return denuncia.acao.status[denuncia.acao.status.length - 1]?.status;
}

type GetIndeferimentoDataReturnProps = {
  indeferidaPor: UsuarioModel | null;
  motivo: string;
} | null;

export function getIndeferimentoData(
  denuncia: DenunciaModel,
): GetIndeferimentoDataReturnProps {
  if (getDenunciaStatus(denuncia) != 'indeferido') {
    return null;
  }

  if (denuncia.denunciaIndeferida) {
    return {
      indeferidaPor: denuncia.denunciaIndeferida.indeferidaPor,
      motivo: denuncia.denunciaIndeferida.motivo,
    };
  }

  if (!denuncia.acao) {
    return null;
  }

  const ultimoAcaoStatus =
    denuncia.acao.status[denuncia.acao.status.length - 1];

  if (!ultimoAcaoStatus) {
    return null;
  }

  return {
    indeferidaPor: ultimoAcaoStatus.alteradoPor,
    motivo: ultimoAcaoStatus.motivo,
  };
}
