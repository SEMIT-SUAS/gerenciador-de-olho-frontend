// usuarioSchema.ts
import { z } from 'zod';
import { unmaskValue } from '@/lib/masks';

export const usuarioSchema = z.object({
  nome: z
    .string()
    .min(2, { message: 'O nome deve ter no mínimo 2 caracteres.' })
    .max(100, { message: 'O nome deve ter no máximo 100 caracteres.' }),
  cpf: z
    .string()
    .transform((value) => unmaskValue(value))
    .refine((value) => value.length === 11, {
      message: 'CPF deve ter 11 dígitos.',
    }),
  contato: z.string().min(10, { message: 'O contato é obrigatório.' }),
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

// ✔️ criar: usa seu schema original (senha obrigatória)
export const usuarioCreateSchema = usuarioSchema;

// ✔️ editar: mesma coisa, mas com senha opcional
export const usuarioEditSchema = usuarioSchema.extend({
  senha: usuarioSchema.shape.senha.optional(),
});

export type UsuarioCreateValues = z.infer<typeof usuarioCreateSchema>;
export type UsuarioEditValues = z.infer<typeof usuarioEditSchema>;

// Se você quiser manter o nome antigo para usos genéricos:
export type usuarioFormValues = UsuarioCreateValues;
