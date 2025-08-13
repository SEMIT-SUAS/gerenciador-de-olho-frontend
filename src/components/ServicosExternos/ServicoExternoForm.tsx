import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getServicoSchema } from './schemaServicoExterno';
import { z } from 'zod';
import {
  updateServicoExterno,
  uploadServicoExterno,
} from '@/services/servicosExternosService';
import type { ServicoExterno } from '@/types/ServicoExterno';

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
  onSuccess: (servico?: ServicoExterno) => void;
  mode?: 'create' | 'edit';
  defaultValues?: ServicoExterno;
};

export function FormServicoExterno({
  onClose,
  onSuccess,
  mode = 'create',
  defaultValues,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const schema = getServicoSchema(mode);
  type ServicoSchema = z.infer<typeof schema>;

  const form = useForm<ServicoSchema>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || {
      nome: '',
      visivel: true,
      ativo: true,
      imagem: '',
    },
  });

  useEffect(() => {
    if (mode === 'edit' && defaultValues?.imagem) {
      setPreviewUrl(defaultValues.imagem);
    }
  }, [mode, defaultValues]);
  const handleSubmit = async (data: ServicoSchema) => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('nome', data.nome);
      formData.append('visivel', String(data.visivel));
      formData.append('link', data.link || '');

      if (mode === 'create') {
        formData.append('ativo', String(data.ativo)); // Apenas no create

        if (data.imagem instanceof File) {
          formData.append('imagem', data.imagem);
        }

        const resultado = await uploadServicoExterno(formData);
        toast.success('Serviço cadastrado com sucesso!');
        onSuccess(resultado);
      } else if (mode === 'edit' && defaultValues?.id) {
        formData.append('id', defaultValues.id.toString());

        if (data.imagem instanceof File) {
          formData.append('imagem', data.imagem);
        }

        await updateServicoExterno(formData);

        toast.success('Serviço atualizado com sucesso!');
        onSuccess({
          ...defaultValues,
          ...data,
          ativo: defaultValues.ativo,
          imagem:
            data.imagem instanceof File ? previewUrl : defaultValues.imagem,
        });
      }

      onClose();
    } catch (error: any) {
      console.error('Erro ao salvar serviço:', error);
      toast.error(error.message || 'Erro ao salvar serviço.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (file: File | undefined) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      form.setValue('imagem', file as any);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-lg">
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
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nome do serviço"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Link */}
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://exemplo.com"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Imagem */}
            <FormField
              control={form.control}
              name="imagem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Imagem {mode === 'create' && '*'}
                    {mode === 'edit' && ' (deixe vazio para manter a atual)'}
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <Input
                        type="file"
                        accept="image/*"
                        disabled={loading}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          handleFileChange(file);
                        }}
                      />

                      {/* Preview da imagem */}
                      {previewUrl && (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            {mode === 'edit' && !(field.value instanceof File)
                              ? 'Imagem atual:'
                              : 'Preview:'}
                          </p>
                          <div className="relative inline-block">
                            <img
                              src={previewUrl}
                              alt="Preview"
                              className="h-32 w-auto rounded-md border-2 border-gray-200 object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  'https://via.placeholder.com/150?text=Erro+ao+carregar';
                              }}
                            />
                            {field.value instanceof File && (
                              <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-bl-md">
                                Nova
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Informações do arquivo */}
                      {field.value instanceof File && (
                        <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                          <p className="font-medium">
                            Novo arquivo selecionado:
                          </p>
                          <p className="text-xs">{field.value.name}</p>
                          <p className="text-xs">
                            Tamanho:{' '}
                            {(field.value.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Visível */}
            <FormField
              control={form.control}
              name="visivel"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between border p-3 rounded-md">
                  <div>
                    <FormLabel className="text-base">Visível</FormLabel>
                    <div className="text-sm text-gray-500">
                      Aparece para os usuários no aplicativo
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Botões */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading
                  ? 'Salvando...'
                  : mode === 'edit'
                  ? 'Atualizar'
                  : 'Cadastrar'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
