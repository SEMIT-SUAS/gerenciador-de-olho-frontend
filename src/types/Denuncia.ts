import type { StatusModel } from './StatusModel';
import type { Endereco } from './Endereco';
import type { Imagem } from './Imagem';

export interface Denuncia {
  id: number;
  titulo: string;
  created_at: string;
  categoria: string;
  tipo: string;
  endereco: Endereco;
  descricao: string;
  images: Imagem[];
  status: StatusModel;
  motivoStatus?: string;
  acaoId?: number;
}
