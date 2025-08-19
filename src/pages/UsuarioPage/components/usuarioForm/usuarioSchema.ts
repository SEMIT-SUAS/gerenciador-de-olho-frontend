import { z } from 'zod';

export const usuarioSchema = z.object({
  nome: z
    .string()
    .min(2, { message: 'O nome deve ter no mínimo 2 caracteres.' })
    .max(100, { message: 'O nome deve ter no máximo 100 caracteres.' }),
  cpf: z
    .string()
    .min(14, { message: 'CPF deve ter 11 dígitos.' })
    .max(14, { message: 'CPF inválido.' }), // Ex: 000.000.000-00
  contato: z.string().min(14, { message: 'O contato é obrigatório.' }), // Ex: (99) 99999-9999
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  senha: z
    .string()
    .min(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
    .max(50, { message: 'A senha deve ter no máximo 50 caracteres.' }),
  ativo: z.boolean(),
  secretaria: z.coerce
    .number({ invalid_type_error: 'Secretaria deve ser um número.' })
    .min(1, { message: 'Secretaria é obrigatória.' }),
  perfil: z.enum(['ADMINISTRADOR', 'COMUM'], {
    required_error: 'Você precisa selecionar um perfil.',
  }),
});

export type usuarioFormValues = z.infer<typeof usuarioSchema>;
