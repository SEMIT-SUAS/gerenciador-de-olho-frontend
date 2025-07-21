import type { AcaoStatusModel } from './AcaoStatus';
import type { SecretariaModel } from './Secretaria';

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
