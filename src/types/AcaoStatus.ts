export type AcaoStatusModelTypes =
  | 'Análise'
  | 'Andamento'
  | 'Indeferido'
  | 'Concluído';

export interface AcaoStatusModel {
  id: number;
  status: AcaoStatusModelTypes;
  motivo: string;
  dataModificacao: string;
}
