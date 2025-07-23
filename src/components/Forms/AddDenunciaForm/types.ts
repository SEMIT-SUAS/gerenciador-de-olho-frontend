import { z } from 'zod/v4';

export const AddDenunciaFormSchema = z.object({
  descricao: z.string().min(3, 'No mínimo 3 caracteres'),
  categoryId: z.number().min(1, 'Selecione uma categoria'),
  categoryTipoId: z.number().min(1, 'Selecione o tipo da categoria'),
  bairro: z.string().min(3, 'No mínimo 3 caracteres'),
  rua: z.string().min(3, 'No mínimo 3 caracteres'),
  pontoDeReferencia: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.string().min(3, 'No mínimo 3 caracteres').optional(),
  ),
  files: z
    .array(z.any())
    .nonempty('Uma denúncia precisa ter no mínimo 1 arquivo')
    .max(5, 'No máximo 5 arquivos'),
});
