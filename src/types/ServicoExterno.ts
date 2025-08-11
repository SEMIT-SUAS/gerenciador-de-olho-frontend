export interface ServiceExterno {
  id: number;
  nome: string
  imagem: string
  link: string
  visivel: boolean
  ativo: boolean
}

export interface ServiceExternoEdit{
  id: number;
  nome: string;
  imagem: string;
  link: string
}