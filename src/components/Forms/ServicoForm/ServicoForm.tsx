import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import React from 'react';

import {
  servicoInputSchema,
  type ServicoFormInput,
  type ServicoFormOutput,
} from './servicoSchema';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
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
    resolver: zodResolver(servicoInputSchema),
    defaultValues: defaultValues || {
      nome: '',
      setorLotacao: '',
      modeloRequerimento: '',
      secretariaId: undefined,
      categoriaId: undefined,
      personaIds: [],
      descricao: '',
      publicoDestinado: [],
      formasSolicitacao: [],
      documentacaoNecessaria: [],
      visivel: true,
      ativo: true,
      etapas: '',
      requisitos: '',
      formasAcompanhamento: '',
      prazoAtendimento: '',
      prioridades: '',
      horarioAtendimento: '',
      legislacao: '',
      custos: '',
    },
  });

  const [docInput, setDocInput] = React.useState('');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Detalhes do Serviço
                </h1>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Nome do Serviço
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Emissão de Certidão Negativa"
                    {...field}
                    className="w-full"
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
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-gray-700">
                  Descrição
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva o serviço em detalhes..."
                    className="resize-y min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="publicoDestinado"
            render={() => (
              <FormItem className="space-y-3">
                <div className="mb-4">
                  <FormLabel className="text-base font-medium text-gray-900">
                    Público Destinado
                  </FormLabel>
                </div>
                <div className="space-y-3">
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
                          <FormLabel className="font-normal text-sm text-gray-700">
                            {item}
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

          <FormField
            control={form.control}
            name="formasSolicitacao"
            render={() => (
              <FormItem className="space-y-3">
                <div className="mb-4">
                  <FormLabel className="text-base font-medium text-gray-900">
                    Formas de Solicitação
                  </FormLabel>
                </div>
                <div className="space-y-3">
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
                          <FormLabel className="font-normal text-sm text-gray-700">
                            {item}
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

          <FormField
            control={form.control}
            name="documentacaoNecessaria"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-sm font-medium text-gray-700">
                  Documentação Necessária
                </FormLabel>
                <FormControl>
                  <div className="space-y-4">
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
                        className="flex-1"
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
                        className="shrink-0"
                      >
                        Adicionar
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {field.value?.map((doc, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-2"
                        >
                          {doc}
                          <button
                            type="button"
                            className="ml-1 rounded-full outline-none hover:bg-gray-300"
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
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Custos
                  </FormLabel>
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
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Prazo de Atendimento
                  </FormLabel>
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
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Horário de Atendimento
                  </FormLabel>
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
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Setor de Lotação
                  </FormLabel>
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
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-gray-700">
                  Etapas
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva as etapas do serviço..."
                    className="min-h-[100px]"
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
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-gray-700">
                  Requisitos
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva os requisitos para solicitar..."
                    className="min-h-[100px]"
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
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-gray-700">
                  Prioridades de Atendimento
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ex: Idosos, gestantes..."
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="formasAcompanhamento"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-gray-700">
                  Formas de Acompanhamento
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ex: Portal do cidadão, telefone..."
                    className="min-h-[80px]"
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
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-gray-700">
                  Legislação
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Leis e decretos relacionados..."
                    className="min-h-[100px]"
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
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-gray-700">
                  Link para Modelo de Requerimento
                </FormLabel>
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
              name="secretariaId"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Secretaria Responsável
                  </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? String(field.value) : ''}
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
              name="categoriaId"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Categoria do Serviço
                  </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? String(field.value) : ''}
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
            name="personaIds"
            render={() => (
              <FormItem className="space-y-3">
                <div className="mb-4">
                  <FormLabel className="text-base font-medium text-gray-900">
                    Personas
                  </FormLabel>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {personas.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="personaIds"
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
                                      currentValues.filter(
                                        (v) => v !== item.id,
                                      ),
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal text-sm text-gray-700">
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
                    <FormLabel className="text-base font-medium">
                      Visível no Portal
                    </FormLabel>
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
                    <FormLabel className="text-base font-medium">
                      Serviço Ativo
                    </FormLabel>
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

          <div className="flex justify-end pt-6">
            <Button type="submit" disabled={isLoading} className="px-8">
              {isLoading ? 'Salvando...' : 'Salvar Serviço'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
