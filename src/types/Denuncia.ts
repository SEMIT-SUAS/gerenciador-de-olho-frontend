import type { StatusModel } from './StatusModel'
import type { Endereco } from './Endereco'
import type { Categoria } from './CategoriaDenuncia'
import type { TipoDenuncia } from './TipoDenuncia'
import type { Imagem } from './Imagem'

export interface Denuncia {
  id: number;
  titulo: string;
  created_at: string;
  categoria: Categoria;
  tipo: TipoDenuncia;
  endereco: Endereco;
  descricao: string;
  images: Imagem[];
  status: StatusModel;
  motivoStatus?: string; // NOVO CAMPO OPCIONAL
  acaoId: number | null;
}