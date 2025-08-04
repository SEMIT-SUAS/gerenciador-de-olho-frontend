import { z } from "zod";

export const portalSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  destaque: z.boolean(),
  link: z.string().url("Link deve ser uma URL válida"),
  visivel: z.boolean(),
  ativo: z.boolean(),
});

export type CreatePortal = z.infer<typeof portalSchema>;
