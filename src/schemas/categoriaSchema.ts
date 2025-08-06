// schemas/categoriaSchema.ts
import { z } from 'zod';

export const categoriaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  icone: z
    .instanceof(File)
    .refine((file) => file.size > 0, 'Arquivo inválido'),
  ativo: z.boolean(),
  visivel: z.boolean(),
});

export type CategoriaSchema = z.infer<typeof categoriaSchema>;

export const categoriaEditarSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  icone: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size > 0, 'Arquivo inválido'),
});

export type CategoriaEditarSchema = z.infer<typeof categoriaEditarSchema>;