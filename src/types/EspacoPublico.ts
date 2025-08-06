export interface EspacoPublicoModel {
  id: number;
  nome: string;
  estado: string;
  cidade: string;
  bairro: string;
  rua: string;
  latitude: number;
  longitude: number;
  capacidadeMaxima: number;
  horaInicio: string;
  horaFim: string;
  visivel: boolean;
  ativo: boolean;
  arquivos: string[];
}
