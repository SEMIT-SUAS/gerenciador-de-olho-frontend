import type { UsuarioModel } from './Usuario';

export interface AcaoStatusModel {
  id: number;
  status: 'aberto' | 'em_andamento' | 'indeferido' | 'concluido';
  motivo: string;
  AlteradoEm: string;
  alteradoPor: UsuarioModel;
}
