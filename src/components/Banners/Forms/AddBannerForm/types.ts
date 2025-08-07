import { z } from 'zod/v4';

export const AddBannerFormSchema = z.object({
  name: z.string().min(2, {
    message: 'O nome deve ter pelo menos 2 caracteres',
  }),
  link: z.string().url({
    message: 'Por favor, insira um link válido',
  }),
  image: z.instanceof(File, {
    message: 'Por favor, selecione uma imagem',
  }),
  visivel: z.boolean(),
});

export type AddBannerFormValues = z.infer<typeof AddBannerFormSchema>;
