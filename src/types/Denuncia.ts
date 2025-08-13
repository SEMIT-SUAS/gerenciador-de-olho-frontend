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

export type DenunciaStatusModelTypes = 'Aberto' | AcaoStatusModelTypes;

export interface DenunciaModel {
  id: number;
  codigo: string;
  descricao: string;
  tipoDenuncia: {
    id: number;
    nome: string;
    categoria: {
      id: number;
      nome: string;
      cor: string;
    };
  };
  bairro: string;
  rua: string;
  latitude: number;
  longitude: number;
  pontoReferencia: string;
  criadoEm: string;
  dadosAcaoParaDenuncia: {
    id: number;
    nome: string;
    secretaria: string;
    status: string;
  } | null;
  denunciaIndeferida: DenunciaIndeferidaModel | null;
}

export interface DenunciaBasicInfoModel {
  id: number;
  nomeTipoDenuncia: string;
  idAcao: number | null;
  status: 'Aberto' | AcaoStatusModelTypes;
  endereco: AddressModel;
  criadaEm: string;
  primeiroArquivo: string;
}
