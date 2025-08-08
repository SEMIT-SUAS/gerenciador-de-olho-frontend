export interface Portais {
  id: number;
  nome: string;
  destaque: boolean;
  link: string;
  visivel: boolean;
  ativo: boolean;
}

export interface CreatePortal {
  nome: string;
  destaque: boolean;
  link: string;
  visivel: boolean;
  ativo: boolean;
}