export interface Services {
  id: number
  nome: string
  descricao: string
  publicoDestinado: string
  formasSolicitacao: string
  documentacaoNecessaria: string
  custos: string
  etapas: string
  requisitos: string
  formasAcompanhamento: string
  prazoAtendimento: string
  prioridades: string
  horarioAtendimento: string
  legislacao: string
  orgao: { nome: string }
  categoria: { nome: string }
  setorLotacao: string
  modeloRequerimento: string
  persona: string
  visivel: boolean
  ativo: boolean
}