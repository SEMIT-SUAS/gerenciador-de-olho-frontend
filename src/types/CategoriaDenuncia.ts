import type { TipoDenunciaModel } from './TipoDenuncia';
export interface CategoriaDenunciaModel {
  id: number;
  nome: string;
  cor: string;
  tipos?: TipoDenunciaModel[];
}
