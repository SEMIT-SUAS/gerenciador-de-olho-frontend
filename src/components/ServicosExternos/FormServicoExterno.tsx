import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { servicoSchema } from './schemaServicoExterno';
import { z } from 'zod';
import { uploadServicoExterno } from '@/services/servicosExternosService';

type ServicoSchema = z.infer<typeof servicoSchema>;
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

type Props = {
  onClose: () => void;
  onSuccess: () => void;
  mode?: 'create' | 'edit';
  defaultValues?: Partial<z.infer<typeof servicoSchema>> & { id?: number };
};

export function FormServicoExterno({
  onClose,
  onSuccess,
  mode = 'create',
  defaultValues,
}: Props) {
  const [loading, setLoading] = useState(false);

  const form = useForm<ServicoSchema>({
    resolver: zodResolver(servicoSchema),
    defaultValues: {
      nome: defaultValues?.nome || '',
      imagem: defaultValues?.imagem,
      visivel: defaultValues?.visivel ?? true,
      ativo: defaultValues?.ativo ?? true,
    },
  });

  const handleSubmit = async (data: ServicoSchema) => {
    setLoading(true);

    const formData = new FormData();
    formData.append('nome', data.nome);
    if (data.imagem && data.imagem instanceof File) {
      formData.append('imagem', data.imagem);
    }
    formData.append('visivel', String(data.visivel));
    formData.append('ativo', String(data.ativo));

    try {
      if (mode === 'edit' && defaultValues?.id) {
        await uploadServicoExterno(formData);
        toast.success(
          mode === 'edit'
            ? 'Serviço atualizado com sucesso!'
            : 'Serviço cadastrado com sucesso!',
        );
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar serviço.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-6">
          {mode === 'edit' ? 'Editar Serviço' : 'Cadastrar Novo Serviço'}
        </h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Nome */}
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do serviço" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Imagem */}
            <FormField
              control={form.control}
              name="imagem"
              render={({
                field: { value, onChange, ...fieldProps },
              }: {
                field: {
                  value: string | File | undefined;
                  onChange: (v: File | undefined) => void;
                };
              }) => (
                <FormItem>
                  <FormLabel>Imagem</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          onChange(file || undefined);
                        }}
                        {...fieldProps}
                      />

                      {/* Mostrar imagem atual no modo edição */}
                      {mode === 'edit' &&
                        typeof value === 'string' &&
                        value && (
                          <div className="text-sm text-blue-600 bg-blue-100 p-2 rounded">
                            Imagem atual:{' '}
                            <span className="font-medium">
                              {value.split('/').pop()}
                            </span>
                            <div className="text-xs text-blue-500 mt-1">
                              Selecione um novo arquivo para substituir
                            </div>
                          </div>
                        )}

                      {/* Mostrar novo arquivo selecionado */}
                      {value instanceof File && (
                        <div className="text-sm text-green-600 bg-green-100 p-2 rounded">
                          Novo arquivo selecionado:{' '}
                          <span className="font-medium">{value.name}</span>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="visivel"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between border p-3 rounded-md">
                  <div>
                    <FormLabel className="text-base">Visível</FormLabel>
                    <div className="text-sm text-gray-500">
                      Aparece para os usuários no portal
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

            {/* Ativo */}
            <FormField
              control={form.control}
              name="ativo"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between border p-3 rounded-md">
                  <div>
                    <FormLabel className="text-base">Ativo</FormLabel>
                    <div className="text-sm text-gray-500">
                      Se desativado, não poderá ser utilizado
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

            {/* Botões */}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
