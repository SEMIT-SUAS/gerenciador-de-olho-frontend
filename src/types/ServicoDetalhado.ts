// types/ServicoDetalhado.ts
export interface ServicoDetalhado {
  id: number | null;
  nome: string;
  descricao: string;
  publicoDestinado: string[];
  formasSolicitacao: string[];
  documentacaoNecessaria: string[];
  custos: string;
  etapas: string;
  requisitos: string;
  formasAcompanhamento: string;
  prazoAtendimento: string;
  prioridades: string;
  horarioAtendimento: string;
  legislacao: string;
  setorLotacao: string;
  modeloRequerimento: string;
  visivel: boolean;
  ativo: boolean;

  // Enriquecidos no retorno:
  nomeCategoria?: string;
  nomeOrgao?: string;
  nomesPersonas?: string[];
}