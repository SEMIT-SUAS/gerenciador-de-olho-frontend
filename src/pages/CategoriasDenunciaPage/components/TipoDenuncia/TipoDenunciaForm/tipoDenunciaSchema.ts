import z from 'zod';

export const TipoDenunciaFormSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres.'),
  secretariaId: z.coerce.number().min(1, 'Selecione uma secretaria.'),
  categoriaId: z.coerce.number().min(1, 'Selecione uma categoria.'),
  icone: z.union([z.instanceof(File), z.string().url()]),
  cor: z.string(),
  visivel: z.boolean(),
  ativo: z.boolean(),
});

export type TipoDenunciaFormValues = z.infer<typeof TipoDenunciaFormSchema>;
