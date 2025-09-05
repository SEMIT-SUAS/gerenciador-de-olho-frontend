export interface Persona {
  id: number;
  nome: string;
  icone: string;
  ordenador: number;
  visivel: boolean;
  ativo: boolean;
}

export interface CreatePersona {
  nome: string;
  icone: File;
  visivel: boolean;
  ativo: boolean;
}
