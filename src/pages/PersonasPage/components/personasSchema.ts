import { z } from 'zod';

export const personaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  icone: z.any().optional(),
  // .refine(
  //   (files) =>
  //     !files || files.length === 0 || files[0]?.type.startsWith('image/'),
  //   'O arquivo deve ser uma imagem',
  // )
  // .optional(),
  visivel: z.boolean(),
  ativo: z.boolean(),
});

// Tipo TypeScript inferido automaticamente do schema
export type PersonaFormData = z.infer<typeof personaSchema>;
