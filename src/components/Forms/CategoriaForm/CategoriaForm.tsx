import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type {
  createServicoCategoria,
  ServicoCategoriaEditar,
} from '../../../types/CategoriaServico';
import { categoriaSchema, type CategoriaSchema } from './CategoriaSchema';
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
import { Switch } from '@/components/ui/switch';

interface Props {
  onSubmit: (
    nova: createServicoCategoria | (ServicoCategoriaEditar & { id: number }),
  ) => void;
  onCancel: () => void;
  isLoading?: boolean;
  defaultValues?: Partial<CategoriaSchema> & { id?: number }; // ← ajustar aqui
  mode?: 'create' | 'edit';
}

export function AddCategoriaForm({
  onSubmit,
  onCancel,
  isLoading = false,
  defaultValues,
  mode = 'create',
}: Props) {
  const form = useForm<CategoriaSchema>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: defaultValues || {
      nome: '',
      icone: undefined,
      ativo: true,
      visivel: true,
    },
  });

  const handleSubmit = (data: CategoriaSchema) => {
    // Sempre enviar ativo como true
    const dataWithAtivo = { ...data, ativo: true };

    if (
      mode === 'edit' &&
      defaultValues?.id &&
      typeof defaultValues.id === 'number'
    ) {
      // Garantir que o id é number
      onSubmit({ ...dataWithAtivo, id: defaultValues.id });
    } else {
      onSubmit(dataWithAtivo);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {mode === 'create'
                ? 'Nova Categoria de Serviço'
                : 'Editar Categoria'}
            </h2>
          </div>

          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-gray-700">
                  Nome da Categoria
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Documentos e Certidões"
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
            name="icone"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-sm font-medium text-gray-700">
                  Ícone da Categoria
                </FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Input
                      {...fieldProps}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        onChange(file || null);
                      }}
                      className="w-full"
                    />

                    {/* Mostrar arquivo atual no modo editar (string) - sempre mostrar se existir */}
                    {mode === 'edit' &&
                      defaultValues?.icone &&
                      typeof defaultValues.icone === 'string' && (
                        <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                          Arquivo atual:{' '}
                          <span className="font-medium">
                            {(defaultValues.icone as string).split('/').pop() ||
                              'imagem.jpg'}
                          </span>
                          {!value && (
                            <div className="text-xs text-blue-500 mt-1">
                              Selecione um novo arquivo para substituir
                            </div>
                          )}
                        </div>
                      )}

                    {/* Mostrar arquivo selecionado (File) */}
                    {value && value instanceof File && (
                      <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                        Novo arquivo selecionado:{' '}
                        <span className="font-medium">{value.name}</span>
                        <div className="text-xs text-green-500 mt-1"></div>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Removido o campo ativo do visual, mas mantendo apenas visível */}
          <FormField
            control={form.control}
            name="visivel"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base font-medium">
                    Visível no Portal
                  </FormLabel>
                  <div className="text-sm text-gray-500">
                    Categoria aparece para usuários
                  </div>
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

          <div className="flex justify-end pt-6 gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="px-8"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="px-8">
              {isLoading ? 'Salvando...' : 'Salvar Categoria'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
