import type { UsuarioModel } from './Usuario';

export interface DenunciaIndeferidaModel {
  id: number;
  indeferidaEm: string;
  motivo: string;
  indeferidaPor: UsuarioModel | null;
}
