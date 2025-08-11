import type { CategoriaDenunciaModel } from './CategoriaDenuncia';
import type { SecretariaModel } from './Secretaria';

export type TipoDenunciaModel = {
  id: number;
  nome: string;
  icone: string;
  cor: string;
  secretaria: SecretariaModel;
  categoria?: CategoriaDenunciaModel;
  visivel: boolean;
  ativo: boolean;
};
