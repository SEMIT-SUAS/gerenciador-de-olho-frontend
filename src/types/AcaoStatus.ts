export type AcaoStatusModelTypes =
  | 'Análise'
  | 'Andamento'
  | 'Indeferido'
  | 'Concluída';

export interface AcaoStatusModel {
  id: number;
  status: AcaoStatusModelTypes;
  motivo: string | null;
  dataModificacao: string;
}
