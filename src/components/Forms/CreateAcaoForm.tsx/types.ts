import { z } from 'zod/v3';

export const CreateAcaoFormSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'O título deve ter no mínimo 3 caracteres.' })
    .max(100, { message: 'O título deve ter no máximo 100 caracteres.' }),
  secretariaId: z
    .number({ invalid_type_error: 'Selecione uma secretaria.' })
    .gt(0, { message: 'Selecione uma secretaria.' }),
  obs: z
    .string()
    .max(500, { message: 'A observação deve ter no máximo 500 caracteres.' })
    .optional(),
});
