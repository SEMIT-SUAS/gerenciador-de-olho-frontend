import { z } from "zod";

export const espacoPublicoSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  estado: z.string().min(1, "Estado é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  bairro: z.string().optional(),
  rua: z.string().optional(),
  latitude: z
    .preprocess((val) => (val === "" ? undefined : parseFloat(String(val))), z.number().optional()),
  longitude: z
    .preprocess((val) => (val === "" ? undefined : parseFloat(String(val))), z.number().optional()),
  capacidade_maxima: z
    .preprocess((val) => (val === "" ? null : parseInt(String(val))), z.number().nullable().optional()),
  hora_inicio: z.string().optional(),
  hora_fim: z.string().optional(),
  visivel: z.boolean().optional(),
  ativo: z.boolean().optional(),
  arquivos: z.any().optional(), // Não validamos arquivos aqui
  id: z.union([z.number(), z.null()]).optional(),
});