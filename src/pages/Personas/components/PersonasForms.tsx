import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { personaSchema, type PersonaFormData } from './personasSchema';
import { updatePersona, uploadPersona } from '@/services/servicoPersona';
import type { Persona } from '@/types/Persona';

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
  onSuccess: (persona?: Persona) => void;
  mode?: 'create' | 'edit';
  defaultValues?: Persona;
};

export function FormPersona({
  onClose,
  onSuccess,
  mode = 'create',
  defaultValues,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const form = useForm<PersonaFormData>({
    resolver: zodResolver(personaSchema),
    defaultValues: defaultValues || {
      nome: '',
      visivel: true,
      ativo: true,
      icone: undefined,
    },
  });

  useEffect(() => {
    if (mode === 'edit' && defaultValues?.icone) {
      setPreviewUrl(defaultValues.icone);
    }
  }, [mode, defaultValues]);

  const handleSubmit = async (data: PersonaFormData) => {
    setLoading(true);

    try {
      if (mode === 'create') {
        // CREATE: não envia ID, ícone é obrigatório
        if (!data.icone || !data.icone[0]) {
          toast.error('Ícone é obrigatório para criar uma nova persona');
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append('nome', data.nome);
        formData.append('icone', data.icone[0]);
        formData.append('visivel', String(data.visivel));
        formData.append('ativo', String(data.ativo));

        const resultado = await uploadPersona(formData);
        toast.success('Persona cadastrada com sucesso!');
        onSuccess(resultado);
      } else if (mode === 'edit' && defaultValues?.id) {
        // EDIT: envia ID obrigatório, ícone opcional
        const formData = new FormData();
        formData.append('id', defaultValues.id.toString());
        formData.append('nome', data.nome);
        formData.append('visivel', String(data.visivel));
        formData.append('ativo', String(data.ativo));

        // Só adiciona ícone se foi selecionado um novo
        if (data.icone && data.icone[0]) {
          formData.append('icone', data.icone[0]);
        }

        await updatePersona(formData);

        toast.success('Persona atualizada com sucesso!');
        onSuccess({
          ...defaultValues,
          ...data,
          icone: data.icone && data.icone[0] ? previewUrl : defaultValues.icone,
        });
      }

      onClose();
    } catch (error: any) {
      console.error('Erro ao salvar persona:', error);
      toast.error(error.message || 'Erro ao salvar persona.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      form.setValue('icone', files);
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
          {mode === 'edit' ? 'Editar Persona' : 'Cadastrar Nova Persona'}
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
                      placeholder="Nome da persona"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ícone */}
            <FormField
              control={form.control}
              name="icone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Ícone {mode === 'create' && '*'}
                    {mode === 'edit' && ' (deixe vazio para manter o atual)'}
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <Input
                        type="file"
                        accept="image/*"
                        disabled={loading}
                        onChange={(e) => {
                          const files = e.target.files;
                          handleFileChange(files);
                        }}
                      />

                      {/* Preview do ícone */}
                      {previewUrl && (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            {mode === 'edit' && !(field.value && field.value[0])
                              ? 'Ícone atual:'
                              : 'Preview:'}
                          </p>
                          <div className="relative inline-block">
                            <img
                              src={previewUrl}
                              alt="Preview"
                              className="h-14 w-auto rounded-md object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  'https://via.placeholder.com/80?text=Erro+ao+carregar';
                              }}
                            />
                            {field.value && field.value[0] && (
                              <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                Novo
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Informações do arquivo */}
                      {field.value && field.value[0] && (
                        <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                          <p className="font-medium">
                            Novo arquivo selecionado:
                          </p>
                          <p className="text-xs">{field.value[0].name}</p>
                          <p className="text-xs">
                            Tamanho:{' '}
                            {(field.value[0].size / 1024 / 1024).toFixed(2)} MB
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
