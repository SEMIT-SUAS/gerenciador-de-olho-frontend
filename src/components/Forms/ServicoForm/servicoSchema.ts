// src/schemas/servicoSchema.ts (Ajustado)

import { z } from 'zod';

export const servicoSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres.'),
  descricao: z.string().min(1, 'A descrição é obrigatória.'),

  publicoDestinado: z
    .array(z.enum(['Pessoa Física', 'Pessoa Jurídica']))
    .min(1, 'Selecione ao menos uma opção para o público.'),
  formasSolicitacao: z
    .array(z.enum(['Presencial', 'Online', 'Telefone']))
    .min(1, 'Selecione ao menos uma forma de solicitação.'),

  documentacaoNecessaria: z.array(z.string()).optional().default([]),

  custos: z.string().optional().default(''),
  etapas: z.string().optional().default(''),
  requisitos: z.string().optional().default(''),
  formasAcompanhamento: z.string().optional().default(''),
  prazoAtendimento: z.string().optional().default(''),
  prioridades: z.string().optional().default(''),
  horarioAtendimento: z.string().optional().default(''),
  legislacao: z.string().optional().default(''),
  setorLotacao: z.string().optional().default(''),
  modeloRequerimento: z.string().optional().default(''),

  nomesPersonas: z.array(z.string()).optional().default([]),

  secretariaId: z.coerce
    .number({ invalid_type_error: 'Selecione uma secretaria.' })
    .min(1, 'Selecione uma secretaria.'),
  categoriaId: z.coerce
    .number({ invalid_type_error: 'Selecione uma categoria.' })
    .min(1, 'Selecione uma categoria.'),
  personaIds: z
    .array(z.coerce.number())
    .min(1, 'Selecione ao menos uma persona.'),

  visivel: z.boolean().default(true),
  ativo: z.boolean().default(true),
});

export type ServicoFormInput = z.input<typeof servicoSchema>;
export type ServicoFormOutput = z.output<typeof servicoSchema>;
