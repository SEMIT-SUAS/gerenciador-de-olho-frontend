import { z } from 'zod';

export const servicoInputSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres.'),
  descricao: z.string().min(1, 'A descrição é obrigatória.'),

  publicoDestinado: z
    .array(z.enum(['Pessoa Física', 'Pessoa Jurídica']))
    .min(1, 'Selecione ao menos uma opção para o público.'),
  formasSolicitacao: z
    .array(z.enum(['Presencial', 'Online', 'Telefone']))
    .min(1, 'Selecione ao menos uma forma de solicitação.'),

  documentacaoNecessaria: z.array(z.string()),

  custos: z.string().optional(),
  etapas: z.string().optional(),
  requisitos: z.string().optional(),
  formasAcompanhamento: z.string().optional(),
  prazoAtendimento: z.string().optional(),
  prioridades: z.string().optional(),
  horarioAtendimento: z.string().optional(),
  legislacao: z.string().optional(),
  setorLotacao: z.string().optional(),
  modeloRequerimento: z.string().optional(),

  nomesPersonas: z.array(z.string()).optional(),

  secretariaId: z.coerce
    .number({ invalid_type_error: 'Selecione uma secretaria.' })
    .min(1, 'Selecione uma secretaria.'),
  categoriaId: z.coerce
    .number({ invalid_type_error: 'Selecione uma categoria.' })
    .min(1, 'Selecione uma categoria.'),
  personaIds: z
    .array(z.coerce.number())
    .min(1, 'Selecione ao menos uma persona.'),

  visivel: z.boolean(),
  ativo: z.boolean(),
});

export const servicoOutputSchema = servicoInputSchema.extend({
  documentacaoNecessaria: z.array(z.string()),
  ativo: z.boolean().default(true),
});

export type ServicoFormInput = z.input<typeof servicoInputSchema>;
export type ServicoFormOutput = z.output<typeof servicoOutputSchema>;
