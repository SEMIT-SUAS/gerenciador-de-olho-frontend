import type { PerfilModel } from './Perfil';
import type { Secretaria } from './Secretaria';

export interface UsuarioModel {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  senha: string;
  secretaria: Secretaria;
  perfil: PerfilModel;
  criadoEm: string;
  criadoPor?: UsuarioModel | null;
}

export interface UsuarioLogin {
  id: number;
  nome: string;
  idSecretaria: number;
  perfil: string;
}
