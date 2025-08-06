export interface ServicosListar {
  nomeOrgao: string | null;
  id: number;
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
  nomeCategoria: string;
  setorLotacao: string;
  modeloRequerimento: string;
  visivel: boolean;
  ativo: boolean;
  nomesPersonas?: string[];
}
