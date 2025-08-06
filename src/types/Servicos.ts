import type { SecretariaModel } from './Secretaria';
import type { Persona } from './Persona';
import type { ServicoCategoria } from './CategoriaServico';

export interface Servicos {
  orgao: SecretariaModel | null;
  id: number | null;
  nome: string;
  descricao: string;
  publicoDestinado: string;
  formasSolicitacao: string;
  documentacaoNecessaria: string;
  custos: string;
  etapas: string;
  requisitos: string;
  formasAcompanhamento: string;
  prazoAtendimento: string;
  prioridades: string;
  horarioAtendimento: string;
  legislacao: string;
  categoria: ServicoCategoria;
  setorLotacao: string;
  modeloRequerimento: string;
  visivel: boolean;
  ativo: boolean;
  personas?: Persona[];
}

export interface UpdateServiceModel {
  secretariaId: number;
  categoriaId: number;
  id: number;
  nome: string;
  descricao: string;
  publicoDestinado: string[];
  formasSolicitacao: string[];
  documentacaoNecessaria: string[];
  custos?: string;
  etapas?: string;
  requisitos?: string;
  formasAcompanhamento?: string;
  prazoAtendimento?: string;
  prioridades?: string;
  horarioAtendimento?: string;
  legislacao?: string;
  setorLotacao?: string;
  modeloRequerimento?: string;
  visivel: boolean;
  ativo: boolean;
  personaIds: number[];
}
