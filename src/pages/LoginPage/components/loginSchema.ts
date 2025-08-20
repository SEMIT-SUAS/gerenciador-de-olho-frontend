import { z } from 'zod';

export const loginSchema = z.object({
  login: z.string().email({ message: 'Por favor, insira um email válido.' }),
  senha: z
    .string()
    .min(6, { message: 'A senha deve ter no mínimo 6 caracteres.' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
