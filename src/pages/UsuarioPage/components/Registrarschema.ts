import { z } from 'zod';

export const cadastroSchema = z.object({
  nome: z
    .string()
    .min(2, { message: 'O nome deve ter no mínimo 2 caracteres.' })
    .max(100, { message: 'O nome deve ter no máximo 100 caracteres.' }),
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  senha: z
    .string()
    .min(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
    .max(50, { message: 'A senha deve ter no máximo 50 caracteres.' }),
});

export type CadastroFormValues = z.infer<typeof cadastroSchema>;
