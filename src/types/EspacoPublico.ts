export interface EspacoPublico {
  nome: string;
  estado: string;
  cidade: string;
  bairro: string;
  rua: string;
  latitude: string;
  longitude: string;
  id: number | null;
  capcidade_maxima: number | null;
  hora_inicio: string;
  hora_fim: string;
  arquivos: FileList;
  visivel: boolean;
  ativo: boolean;
}