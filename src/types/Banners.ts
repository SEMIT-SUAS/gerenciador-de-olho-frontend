export interface Banner {
  id: number;
  nome: string;
  imagem: string;
  link: string | null;
  visivel: boolean;
  ativo: boolean;
}