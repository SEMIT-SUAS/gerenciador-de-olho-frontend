import type { Secretaria } from '../types/Secretaria';
import type { Persona } from './Persona';

export interface Services {
  orgao: number | null;
  secretaria: Secretaria | null
  id: number
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
  categoria: {
    id: null; nome: string 
}
  setorLotacao: string
  modeloRequerimento: string
  persona: Persona[]
  visivel: boolean
  ativo: boolean
}