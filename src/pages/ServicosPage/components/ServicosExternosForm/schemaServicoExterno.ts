import { z } from 'zod';

export const servicoCreateSchema = z.object({
  nome: z.string().min(1, 'O nome é obrigatório.'),
  link: z.string().url('URL inválida').optional().or(z.literal('')),
  visivel: z.boolean(),
  ativo: z.boolean(),
  imagem: z
    .instanceof(File, { message: 'Imagem é obrigatória ao criar um serviço' })
    .refine((file) => file.type.startsWith('image/'), {
      message: 'O arquivo deve ser uma imagem.',
    })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: 'A imagem deve ter no máximo 5MB.',
    }),
});

export const servicoEditSchema = z.object({
  nome: z.string().min(1, 'O nome é obrigatório.'),
  link: z.string().url('URL inválida').optional().or(z.literal('')),
  visivel: z.boolean(),
  ativo: z.boolean(),
  imagem: z
    .union([z.instanceof(File), z.string().url('URL de imagem inválida')])
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        if (typeof value === 'string') return true;
        if (value instanceof File) {
          return (
            value.type.startsWith('image/') && value.size <= 5 * 1024 * 1024
          );
        }
        return false;
      },
      {
        message: 'A imagem deve ser válida e ter no máximo 5MB.',
      },
    ),
});

export const getServicoSchema = (mode: 'create' | 'edit') => {
  return mode === 'create' ? servicoCreateSchema : servicoEditSchema;
};
