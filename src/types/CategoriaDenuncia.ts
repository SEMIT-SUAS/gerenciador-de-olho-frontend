import type { TipoDenuncia } from "./TipoDenuncia";

export type Categoria = {
  id: number
  description: string
  name: 'Infraestrutura'| 'Meio Ambiente' | 'Trânsito e Transporte' | 'Acessibilidade' | 'Saúde Pública';
  tipos: TipoDenuncia[]
} 