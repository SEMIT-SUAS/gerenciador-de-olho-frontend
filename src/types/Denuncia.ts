import type { AcaoStatusModelTypes } from './AcaoStatus';
import type { EnderecoModel } from '@/types/Endereco';
import type { DenunciaIndeferidaModel } from './DenunciaIndeferidaModel';

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
  pontoReferencia: string;
  latitude: number;
  longitude: number;
  dataInicio: string;
  dadosAcaoParaDenuncia: {
    id: number;
    nome: string;
    secretaria: string;
    status: AcaoStatusModelTypes;
  } | null;
  idUsuario: number;
  urls: string[];
  denunciaIndeferida: DenunciaIndeferidaModel;
}

export interface DenunciaBasicInfoModel {
  id: number;
  nomeTipoDenuncia: string;
  idAcao: number | null;
  status: 'Aberto' | AcaoStatusModelTypes;
  endereco: EnderecoModel;
  criadaEm: string;
  primeiroArquivo: string;
}

export interface DenunciaInMap {
  id: number;
  nomeTipoDenuncia: string;
  acaoStatus: string;
  latitude: number;
  longitude: number;
  criadoEm: string;
}
