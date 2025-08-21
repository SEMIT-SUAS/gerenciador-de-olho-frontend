import type { AcaoStatusModel } from './AcaoStatus';
import type { DenunciaModel } from './Denuncia';
import type { SecretariaModel } from './Secretaria';

export interface CreateAcaoModel {
  nome: string;
  obs: string | null;
  secretariaId: number;
  denuncias: DenunciaModel[];
}

export interface AcaoModel {
  id: number;
  nome: string;
  latitude: number;
  longitude: number;
  obs: string | null;
  criadoEm: string;
  secretaria: SecretariaModel;
  status: AcaoStatusModel[];
}

export interface AcaoInMap {
  id: number;
  latitude: number;
  longitude: number;
}
