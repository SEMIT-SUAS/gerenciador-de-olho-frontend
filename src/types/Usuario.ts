import type { PerfilModel } from './Perfil';
import type { SecretariaModel } from './Secretaria';

export interface UsuarioModel {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  senha: string;
  secretaria: SecretariaModel;
  perfil: PerfilModel;
  criadoEm: string;
  criadoPor?: UsuarioModel | null;
}
