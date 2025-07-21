import type { CategoriaDenunciaModel } from './CategoriaDenuncia';

export type TipoDenunciaModel = {
  id: number;
  cor: string;
  nome: string;
  categoria: CategoriaDenunciaModel;
};
