// schemas/secretariaSchema.ts
import { z } from 'zod';

export const secretariaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  sigla: z.string().min(1, 'Sigla é obrigatória'),
  visivel: z.boolean(),
  ativo: z.boolean(),
});

export type CreateSecretaria = z.infer<typeof secretariaSchema>;
