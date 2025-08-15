import type { CategoriaDenunciaModel } from './CategoriaDenuncia';
import type { Secretaria } from './Secretaria';

export type TipoDenunciaModel = {
  id: number;
  nome: string;
  icone: File;
  cor: string;
  secretaria: string;
  categoria: string;
  visivel: boolean;
  ativo: boolean;
};

export type TipoDenunciaListar = {
  id: number;
  nome: string;
  icone: string;
  cor: string;
  secretaria: string;
  categoria: string;
  visivel: boolean;
  ativo: boolean;
};
