import type { PerfilModel } from './Perfil';
import type { Secretaria } from './Secretaria';

export interface UsuarioModel {
  id: number;
  nome: string;
  cpf: string;
  contato: string;
  email: string;
  senha: string;
  idSecretaria: number;
  perfil: string;
  criadoEm: string;
  ativo: boolean
  criadoPor?: UsuarioModel | null;
}

export interface UsuarioPorId {
  id: number;
  nome: string;
  cpf: string;
  contato: string;
  email: string;
  senha: string;
  secretaria: string;
  perfil: string;
  criadoEm: string;
  ativo: boolean
  criadoPor?: UsuarioModel | null;
}

export interface UsuarioLogin {
  id: number;
  nome: string;
  idSecretaria: number;
  perfil: string;
}

export interface UsuarioUpdate {
  id: number
  nome: string 
  contato: string
}
