import type { AcaoStatusModel } from './AcaoStatus';
import type { DenunciaBasicInfoModel, DenunciaModel } from './Denuncia';

export interface CreateAcaoModel {
  nome: string;
  obs: string | null;
  secretariaId: number;
  denuncias: DenunciaModel[];
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
