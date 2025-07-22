import type { UsuarioModel } from './Usuario';

export type AcaoStatusModelTypes =
  | 'em_analise'
  | 'em_andamento'
  | 'indeferido'
  | 'concluido';

export interface AcaoStatusModel {
  id: number;
  status: AcaoStatusModelTypes;
  motivo: string;
  AlteradoEm: string;
  alteradoPor: UsuarioModel;
}
