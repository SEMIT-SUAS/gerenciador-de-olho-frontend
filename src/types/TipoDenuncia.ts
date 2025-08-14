import type { CategoriaDenunciaModel } from './CategoriaDenuncia';
import type { Secretaria } from './Secretaria';

export type TipoDenunciaModel = {
  id: number;
  nome: string;
  icone: string;
  secretaria: string;
  categoria: string;
  visivel: boolean;
  ativo: boolean;
};
