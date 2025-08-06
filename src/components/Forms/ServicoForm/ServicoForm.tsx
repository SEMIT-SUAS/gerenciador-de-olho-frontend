import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import React from 'react';

import {
  servicoSchema,
  type ServicoFormInput,
  type ServicoFormOutput,
} from './servicoSchema';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import type { SecretariaModel } from '@/types/Secretaria';
import type { ServicoCategoria } from '@/types/CategoriaServico';
import type { Persona } from '@/types/Persona';

interface ServicoFormProps {
  secretarias: SecretariaModel[];
  categorias: ServicoCategoria[];
  personas: Persona[];
  onSubmit: (data: ServicoFormOutput) => void;
  isLoading?: boolean;
  defaultValues?: Partial<ServicoFormInput>;
}

const publicoDestinadoOptions = ['Pessoa Física', 'Pessoa Jurídica'] as const;
const formasSolicitacaoOptions = ['Presencial', 'Online', 'Telefone'] as const;

export function ServicoForm({
  secretarias,
  categorias,
  personas,
  onSubmit,
  isLoading = false,
  defaultValues,
}: ServicoFormProps) {
  const form = useForm<ServicoFormInput>({
    resolver: zodResolver(servicoSchema),
    defaultValues: {
      nome: defaultValues?.nome ?? '',
      setorLotacao: defaultValues?.setorLotacao ?? '',
      modeloRequerimento: defaultValues?.modeloRequerimento ?? '',
      secretariaId: defaultValues?.secretariaId ?? undefined,
      categoriaId: defaultValues?.categoriaId ?? undefined,
      personaIds: defaultValues?.personaIds ?? [],
      descricao: defaultValues?.descricao ?? '',
      publicoDestinado: defaultValues?.publicoDestinado ?? [],
      formasSolicitacao: defaultValues?.formasSolicitacao ?? [],
      documentacaoNecessaria: defaultValues?.documentacaoNecessaria ?? [],
      custos: defaultValues?.custos ?? '',
      visivel: defaultValues?.visivel ?? true,
      ativo: defaultValues?.ativo ?? true,
      etapas: defaultValues?.etapas ?? '',
      requisitos: defaultValues?.requisitos ?? '',
      formasAcompanhamento: defaultValues?.formasAcompanhamento ?? '',
      prazoAtendimento: defaultValues?.prazoAtendimento ?? '',
      prioridades: defaultValues?.prioridades ?? '',
      horarioAtendimento: defaultValues?.horarioAtendimento ?? '',
      legislacao: defaultValues?.legislacao ?? '',
    },
  });

  const [docInput, setDocInput] = React.useState('');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* --- Nome e Descrição --- */}
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Serviço</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Emissão de Certidão Negativa"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva o serviço em detalhes..."
                  className="resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- Checkboxes --- */}
        <FormField
          control={form.control}
          name="publicoDestinado"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Público Destinado</FormLabel>
              </div>
              {publicoDestinadoOptions.map((item) => (
                <FormField
                  key={item}
                  control={form.control}
                  name="publicoDestinado"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(item)}
                          onCheckedChange={(checked) => {
                            const currentValues = field.value ?? [];
                            return checked
                              ? field.onChange([...currentValues, item])
                              : field.onChange(
                                  currentValues.filter((v) => v !== item),
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">{item}</FormLabel>
                    </FormItem>
                  )}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="formasSolicitacao"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">
                  Formas de Solicitação
                </FormLabel>
              </div>
              {formasSolicitacaoOptions.map((item) => (
                <FormField
                  key={item}
                  control={form.control}
                  name="formasSolicitacao"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(item)}
                          onCheckedChange={(checked) => {
                            const currentValues = field.value ?? [];
                            return checked
                              ? field.onChange([...currentValues, item])
                              : field.onChange(
                                  currentValues.filter((v) => v !== item),
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">{item}</FormLabel>
                    </FormItem>
                  )}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- Campos de Tags Dinâmicas --- */}
        <FormField
          control={form.control}
          name="documentacaoNecessaria"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Documentação Necessária</FormLabel>
              <FormControl>
                <div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Digite um documento e pressione Enter..."
                      value={docInput}
                      onChange={(e) => setDocInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && docInput.trim()) {
                          e.preventDefault();
                          field.onChange([
                            ...(field.value ?? []),
                            docInput.trim(),
                          ]);
                          setDocInput('');
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        if (docInput.trim()) {
                          field.onChange([
                            ...(field.value ?? []),
                            docInput.trim(),
                          ]);
                          setDocInput('');
                        }
                      }}
                    >
                      Adicionar
                    </Button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {field.value?.map((doc, index) => (
                      <Badge key={index} variant="secondary">
                        {doc}
                        <button
                          type="button"
                          className="ml-2 rounded-full outline-none"
                          onClick={() => {
                            const newValue = [...(field.value ?? [])];
                            newValue.splice(index, 1);
                            field.onChange(newValue);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="custos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custos</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Gratuito" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="prazoAtendimento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prazo de Atendimento</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 5 dias úteis" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="horarioAtendimento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário de Atendimento</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 08:00 às 18:00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="setorLotacao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Setor de Lotação</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Protocolo Geral" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="etapas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Etapas</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva as etapas do serviço..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="requisitos"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Requisitos</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva os requisitos para solicitar..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="prioridades"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prioridades de Atendimento</FormLabel>
              <FormControl>
                <Textarea placeholder="Ex: Idosos, gestantes..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="formasAcompanhamento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Formas de Acompanhamento</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ex: Portal do cidadão, telefone..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="legislacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Legislação</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Leis e decretos relacionados..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="modeloRequerimento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link para Modelo de Requerimento</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- Selects de ID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="secretariaId" // NOME AJUSTADO
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secretaria Responsável</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma secretaria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {secretarias.map((sec) => (
                      <SelectItem key={sec.id} value={String(sec.id)}>
                        {sec.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoriaId" // NOME AJUSTADO
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria do Serviço</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categorias.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="personaIds" // NOME AJUSTADO
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Personas</FormLabel>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {personas.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="personaIds" // NOME AJUSTADO
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              const currentValues = field.value ?? [];
                              return checked
                                ? field.onChange([...currentValues, item.id])
                                : field.onChange(
                                    currentValues.filter((v) => v !== item.id),
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item.nome}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- Switches Booleanos --- */}
        <div className="flex items-center space-x-8">
          <FormField
            control={form.control}
            name="visivel"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 flex-grow">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Visível no Portal</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ativo"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 flex-grow">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Serviço Ativo</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar Serviço'}
        </Button>
      </form>
    </Form>
  );
}
