export interface ServicoCategoria {
  id: number;
  nome: string;
  visivel: boolean;
  ativo: boolean;
  icone: File | null;
}

export interface createServicoCategoria{
  nome: string;
  visivel: boolean;
  ativo: boolean;
  icone: File | null;
}

export interface ServicoCategoriaEditar {
  id: number;
  nome: string;
  icone?: File | string;
}
