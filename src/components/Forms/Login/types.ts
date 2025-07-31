import { z } from 'zod/v4';

export const LoginFormSchema = z.object({
  email: z.email('email inválido'),
  senha: z.string().min(3, 'no mínimo 3 caracteres'),
});

export type LoginFormData = z.infer<typeof LoginFormSchema>;
