import type { TipoDenuncia } from './TipoDenuncia'

export type Categorias = 'Infraestrutura' | 'Meio Ambiente' | 'Trânsito e Mobilidade' | 'Acessibilidade' | 'Saúde pública';

export type Categoria = {
  id: number
  description: string
  name: Categorias;
  tipos: TipoDenuncia[]
}