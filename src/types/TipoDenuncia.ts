import type { CategoriaDenunciaModel } from './CategoriaDenuncia';

export type TipoDenunciaModel = {
  id: number;
  nome: string;
  categoria?: CategoriaDenunciaModel;
};
