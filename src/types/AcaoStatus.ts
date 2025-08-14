import type { UsuarioModel } from './Usuario';

export type AcaoStatusModelTypes =
  | 'Análise'
  | 'Andamento'
  | 'Indeferido'
  | 'Concluído';

export interface AcaoStatusModel {
  id: number;
  status: AcaoStatusModelTypes;
  motivo: string | null;
  AlteradoEm: string;
  alteradoPor: UsuarioModel;
}
