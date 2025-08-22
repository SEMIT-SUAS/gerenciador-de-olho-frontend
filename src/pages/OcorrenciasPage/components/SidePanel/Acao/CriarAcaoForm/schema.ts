import { z } from 'zod';

export const CreateAcaoFormSchema = z.object({
  nome: z.string().min(3, 'no mínimo 3 caracteres'),
  secretariaId: z.coerce.number().min(1, 'campo obrigatório'),
  descricao: z.string().min(3, 'no mínimo 3 caracteres'),
  observacao: z.string().min(3, 'no mínimo 3 caracteres').optional(),
});

export type CreateAcaoFormValues = z.infer<typeof CreateAcaoFormSchema>;
