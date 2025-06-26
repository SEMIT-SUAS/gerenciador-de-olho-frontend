import type { StatusModel } from "./StatusModel";
import type { Endereco } from "./Endereco";
import type { CategoriaDenuncia } from "./CategoriaDenuncia";
import type { TipoDenuncia } from "./TipoDenuncia";
import type { Imagem } from "./Imagem";

export interface Denuncia {
  id: number;
  titulo: string;
  created_at: string;
  categoria: CategoriaDenuncia;
  tipo: TipoDenuncia;
  endereco: Endereco;
  descricao: string;
  images: Imagem[];
  status: StatusModel;
  acaoId: number | null; 
}