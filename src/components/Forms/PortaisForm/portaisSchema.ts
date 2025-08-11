import z from "zod";

export const portaisSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres.'),
  categoria: z.enum(["Cidadão", "Servidor", "Empresa"]).optional(),
  destaque: z.boolean(), // Adicionado default
  link: z.string().url('Por favor, insira uma URL válida.'),
  visivel: z.boolean(),  // Adicionado default
  ativo: z.boolean()   // Adicionado default
});

export type PortaisSchema = z.infer<typeof portaisSchema>;



