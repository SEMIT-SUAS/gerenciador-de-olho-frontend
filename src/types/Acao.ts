import type { AcaoStatusModel } from './AcaoStatus';
import type { DenunciaBasicInfoModel } from './Denuncia';

export interface CreateAcaoModel {
  nome: string;
  latitude: number;
  longitude: number;
  descricao: string;
  observacao?: string;
  bairro: string;
  secretaria: number;
  denuncias: number[];
  acaoStatus: {
    status: string;
    motivo: string;
    modificadoEm: string;
  };
  ativo: boolean;
}

export interface AcaoModel {
  id: number;
  nome: string;
  descricao: string;
  latitude: number;
  longitude: number;
  criadoEm: string;
  nomeSecretaria: string;
  siglaSecretaria: string;
  bairro: string;
  acaoStatus: AcaoStatusModel;
  denuncias: DenunciaBasicInfoModel[];
}

export interface UpdatedAcaoModel {
  mensagem: string;
  acao: AcaoModel;
}

export interface AcaoInMap {
  id: number;
  latitude: number;
  longitude: number;
}

export interface UpdateAcao {
  id: number;
  acaoStatus: AcaoStatusModel;
  ativo: boolean;
}
