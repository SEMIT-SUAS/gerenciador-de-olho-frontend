import { z } from 'zod/v4';

export const AddEspacoPublicoFormSchema = z.object({
  name: z.string().trim().min(1, 'O nome é obrigatório'),
  addressRua: z.string().min(1, 'A rua é obrigatória'),
  addressBairro: z.string().min(1, 'O bairro é obrigatório'),
  maxCapacity: z.coerce
    .number('A capacidade máxima deve ser maior que 0')
    .min(1, 'A capacidade máxima deve ser maior que 0'),
  startHour: z.string().min(1, 'Campo obrigatório'),
  endHour: z.string().min(1, 'Campo obrigatório'),
  visivel: z.boolean(),
  files: z
    .array(z.instanceof(File))
    .min(1, 'Pelo menos uma imagem é obrigatória'),
});

export type AddEspacoPublicoFormValues = z.infer<
  typeof AddEspacoPublicoFormSchema
>;
