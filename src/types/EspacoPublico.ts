export interface EspacoPublico {
  nome: string;
  estado: string;
  cidade: string;
  bairro: string;
  rua: string;
  latitude: string;
  longitude: string;
  id: number | null;
  capacidade_maxima: number | null;
  hora_inicio: string;
  hora_fim: string;
  arquivos: FileList;
  visivel: boolean;
  ativo: boolean;
}

export interface EspacoPublicoById{
  nome: string;
  estado: string;
  cidade: string;
  bairro: string;
  rua: string;
  latitude: string;
  longitude: string;
  id: number | null;
  capacidadeMaxima: number | null;
  horaInicio: string;
  horaFim: string;
  arquivos: FileList | string[];
  visivel: boolean;
  ativo: boolean;
}