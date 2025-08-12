import type { AcaoModel } from './Acao';
import type { AcaoStatusModelTypes } from './AcaoStatus';
import type { AddressModel } from './Address';
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
  denunciaIndeferida: DenunciaIndeferidaModel | null;
}

export interface DenunciaBasicInfoModel {
  id: number;
  nomeTipoDenuncia: string;
  idAcao: number | null;
  status: 'aberto' | AcaoStatusModelTypes;
  endereco: AddressModel;
  criadaEm: string;
  primeiroArquivo: string;
}
