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

export type DenunciaStatusModelTypes = 'Aberto' | AcaoStatusModelTypes;

export interface DenunciaModel {
  id: number;
  descricao: string;
  tipo: TipoDenunciaModel;
  files: DenunciaFile[];
  acao: AcaoModel | null;

  bairro: string;
  rua: string;
  pontoDeReferencia?: string | null;
  longitude: number;
  latitude: number;

  criadaEm: string;

  usuario: UsuarioModel | null;
  denunciaIndeferida: DenunciaIndeferidaModel | null;
}
