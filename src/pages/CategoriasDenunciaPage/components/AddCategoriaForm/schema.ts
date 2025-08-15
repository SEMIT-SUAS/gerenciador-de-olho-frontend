import z from 'zod';

export const AddCategoriaFormSchema = z.object({
  name: z.string().trim().min(1, 'Nome obrigatório.'),
  description: z.string().min(3, 'No mínimo 3 caracteris').optional(),
  icon: z.instanceof(File, {
    message: 'Icone é obrigatório',
  }),
  cor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'Formato hexadecimal inválido (ex: #RRGGBB ou #RGB)',
  }),
  fixed: z.boolean(),
  visivel: z.boolean(),
});

export type AddCategoriaFormValues = z.infer<typeof AddCategoriaFormSchema>;
