import { z } from 'zod';

export const servicoSchema = z.object({
  nome: z.string().min(1, 'O nome é obrigatório.'),
  visivel: z.boolean(),
  ativo: z.boolean(),
  imagem: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.type.startsWith('image/'), {
      message: 'A imagem deve ser um arquivo do tipo imagem.',
    }),
});
