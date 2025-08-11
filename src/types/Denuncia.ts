import type { AcaoModel } from './Acao';
import type { AcaoStatusModelTypes } from './AcaoStatus';
import type { DenunciaFile } from './DenunciaFile';
import type { DenunciaIndeferidaModel } from './DenunciaIndeferidaModel';
import type { TipoDenunciaModel } from './TipoDenuncia';
import type { UsuarioModel } from './Usuario';

export interface CreateDenunciaModel {
  descricao: string;
  tipoId: number;
  files: File[];
  bairro: string;
  rua: string;
  pontoDeReferencia?: string | null;
  longitude: number;
  latitude: number;
}

export type DenunciaStatusModelTypes = 'aberto' | AcaoStatusModelTypes;

export interface DenunciaModel {
  id: number;
  codigo: string;
  descricao: string;
  tipo: TipoDenunciaModel;
  acao: AcaoModel | null;

  estado: string;
  cidade: string;
  bairro: string;
  rua: string;
  pontoDeReferencia?: string | null;
  longitude: number;
  latitude: number;

  criadaEm: string;
  dataFim: string;
  ativo: boolean;
  usuario: UsuarioModel | null;
  // denunciaIndeferida: DenunciaIndeferidaModel | null;
}

export interface DenunciaModelMap {
  id: number;
  nomeTipoDenuncia: string;
  acaoStatus: string | null;
  latitude: number;
  longitude: number;
  criadaEm: string;
}

export interface DenunciaModelList {
  id: number;
  nomeTipoDenuncia: string;
  acaoStatus: string | null;
  criadoEm: string;
  endereco: string; // Junta rua e bairro Ex: Rua Dez, Cohama
  firstFile: string;
}
