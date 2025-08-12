import { z } from 'zod';

export const categoriaDenunciaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  cor: z.string().regex(/^#([0-9a-fA-F]{6})$/, 'Cor deve ser hexadecimal no formato #RRGGBB'),
  destaque: z.boolean(),
  ativo: z.boolean(),
  visivel: z.boolean(),
  icone: z
    .any()
    .refine((file) => file instanceof File, {
      message: 'Ícone é obrigatório e deve ser um arquivo',
    }),
});