import { z } from 'zod';

export const usuarioEditSchema = z.object({
  nome: z
    .string()
    .min(2, { message: 'O nome deve ter no mínimo 2 caracteres.' })
    .max(100, { message: 'O nome deve ter no máximo 100 caracteres.' }),
  contato: z.string().min(10, { message: 'O contato é obrigatório.' }),
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
});

export type UsuarioEditValues = z.infer<typeof usuarioEditSchema>;
