import type { UsuarioModel } from './Usuario';

export type AcaoStatusModelTypes =
  | 'em_analise'
  | 'em_andamento'
  | 'indeferido'
  | 'concluido';

export interface AcaoStatusModel {
  id: number;
  status: AcaoStatusModelTypes;
  motivo: string | null;
  AlteradoEm: string;
  alteradoPor: UsuarioModel;
}
