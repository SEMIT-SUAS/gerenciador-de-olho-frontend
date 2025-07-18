import { z } from 'zod/v4';

export const AddDenunciaFormType = z.object({
  categoryId: z.number().min(1, 'Selecione uma categoria'),
  categoryTipoId: z.number().min(1, 'Selecione o tipo da categoria'),
  address: z.object({
    bairro: z.string().min(3, 'No mínimo 3 caracteres'),
    rua: z.string().min(3, 'No mínimo 3 caracteres'),
    pontoDeReferencia: z.string().min(3, 'No mínimo 3 caracteres'),
  }),
  description: z.string().min(5, 'No mínimo 5 caracteres'),
  files: z
    .array(z.any())
    .nonempty('Uma denúncia precisa ter no mínimo 1 arquivo')
    .max(5, 'No máximo 5 arquivos'),
});
