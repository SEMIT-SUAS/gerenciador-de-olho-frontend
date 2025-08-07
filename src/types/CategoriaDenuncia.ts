export interface GetCategoriaDenuncia {
  id: number;
  nome: string;
  descricao: string;
  icone: string;      // nome do arquivo da imagem
  cor: string;        // hexadecimal
  destaque: boolean;
  visivel: boolean;
  ativo: boolean;
}

export interface FormCategoriaDenuncia{
  nome: string;
  descricao: string;
  icone: File | null;      // nome do arquivo da imagem
  cor: string;        // hexadecimal
  destaque: boolean;
  visivel: boolean;
  ativo: boolean;
}
