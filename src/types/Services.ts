import type { SecretariaModel } from '../types/Secretaria';
import type { Persona } from './Persona';
import type { ServicoCategoria } from './CategoriaServico';

export interface Services {
  orgao: number | null;
  secretaria: SecretariaModel | null
  id: number | null;
  nome: string
  descricao: string
  publicoDestinado: string[]
  formasSolicitacao: string[]
  documentacaoNecessaria: string[]
  custos: string
  etapas: string
  requisitos: string
  formasAcompanhamento: string
  prazoAtendimento: string
  prioridades: string
  horarioAtendimento: string
  legislacao: string
  nomeCategoria: string,
  setorLotacao: string
  modeloRequerimento: string
  nomesPersonas?: string[],
  visivel: boolean
  ativo: boolean
  nomeOrgao?: string;
}

export interface CreateService {
  orgao: number | null;
  secretaria: SecretariaModel | null
  id: number | null;
  nome: string
  descricao: string
  publicoDestinado: string[]
  formasSolicitacao: string[]
  documentacaoNecessaria: string[]
  custos: string
  etapas: string
  requisitos: string
  formasAcompanhamento: string
  prazoAtendimento: string
  prioridades: string
  horarioAtendimento: string
  legislacao: string
  categoria: ServicoCategoria | null;
  setorLotacao: string
  modeloRequerimento: string
  persona: Persona[]
  visivel: boolean
  ativo: boolean
}