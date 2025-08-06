import { z } from 'zod/v4';

export const AddEspacoPublicoFormSchema = z.object({
  name: z.string().trim().min(1, 'O nome é obrigatório'),
  bairro: z.string().trim().min(1, 'O bairro é obrigatório'),
  rua: z.string().trim().min(1, 'A rua é obrigatória'),
  maxCapacity: z.coerce
    .number()
    .min(1, 'A capacidade máxima deve ser maior que 0')
    .max(1000, 'Capacidade máxima não pode exceder 1000'),

  startHour: z
    .string()
    .min(1, 'Hora de início é obrigatória')
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato inválido (use HH:MM)'),

  endHour: z
    .string()
    .min(1, 'Hora de fim é obrigatória')
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato inválido (use HH:MM)')
    .superRefine((val, ctx) => {
      if (val <= ctx.parent.startHour) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Horário final deve ser após o horário inicial',
        });
      }
    }),
  files: z
    .array(z.instanceof(File))
    .min(1, 'Pelo menos um arquivo é obrigatório'),
});

export type AddEspacoPublicoFormValues = z.infer<
  typeof AddEspacoPublicoFormSchema
>;
