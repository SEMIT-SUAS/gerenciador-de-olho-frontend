import z from 'zod';

export const EditCategoriaFormSchema = z.object({
  name: z.string().trim().min(1, 'Nome obrigatório.'),
  description: z.string().min(3, 'No mínimo 3 caracteris').optional(),
  icon: z
    .instanceof(File, {
      message: 'Icone é obrigatório',
    })
    .optional(),
  cor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'Formato hexadecimal inválido (ex: #RRGGBB ou #RGB)',
  }),
  fixed: z.boolean(),
});

export type EditCategoriaFormValues = z.infer<typeof EditCategoriaFormSchema>;
