import { z } from 'zod/v4';

export const AddEspacoPublicoFormSchema = z.object({
  name: z.string().trim().min(1, 'O nome é obrigatório'),
  address: z.string().min(1, 'O endereço é obrigatório'),
  maxCapacity: z.coerce
    .number()
    .min(1, 'A capacidade máxima deve ser maior que 0'),
  startHour: z.string().min(1, 'Hora de início é obrigatória'),
  endHour: z.string().min(1, 'Hora de fim é obrigatória'),
  visivel: z.boolean(),
  files: z
    .array(z.instanceof(File))
    .min(1, 'Pelo menos uma imagem é obrigatória'),
});

export type AddEspacoPublicoFormValues = z.infer<
  typeof AddEspacoPublicoFormSchema
>;
