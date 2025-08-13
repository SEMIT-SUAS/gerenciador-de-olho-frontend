import { z } from 'zod';

// Validação customizada para garantir que é um File válido
const fileValidator = z.custom<File | null>(
  (value) => {
    return value instanceof File && value.size > 0;
  },
  { message: 'Arquivo inválido' },
);

export const categoriaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  icone: fileValidator,
  ativo: z.boolean(),
  visivel: z.boolean(),
});

export type CategoriaSchema = z.infer<typeof categoriaSchema>;

export const categoriaEditarSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  icone: fileValidator.optional(),
});

export type CategoriaEditarSchema = z.infer<typeof categoriaEditarSchema>;
