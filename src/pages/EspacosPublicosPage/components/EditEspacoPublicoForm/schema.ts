import { z } from 'zod/v4';

export const EditEspacoPublicoFormSchema = z.object({
  name: z.string().trim().min(1, 'O nome é obrigatório'),
  addressRua: z.string().min(1, 'A rua é obrigatória'),
  addressBairro: z.string().min(1, 'O bairro é obrigatório'),
  maxCapacity: z.number().min(1, 'A capacidade máxima deve ser maior que 0'),
  startHour: z.string().min(1, 'Hora de início é obrigatória'),
  endHour: z.string().min(1, 'Hora de fim é obrigatória'),
  files: z.array(z.instanceof(File)).optional(),
  visivel: z.boolean(),
});

export type EditEspacoPublicoFormValues = z.infer<
  typeof EditEspacoPublicoFormSchema
>;
