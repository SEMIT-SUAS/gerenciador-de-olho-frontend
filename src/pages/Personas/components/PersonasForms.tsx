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
import { ImageInput } from '@/components/Forms/ImageInput';

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

  const form = useForm<PersonaFormData>({
    resolver: zodResolver(personaSchema),
    defaultValues: defaultValues || {
      nome: '',
      visivel: true,
      ativo: true,
      icone: undefined,
    },
  });

  // Se estiver em modo de edição, define o valor inicial do ícone
  useEffect(() => {
    if (mode === 'edit' && defaultValues?.icone) {
      form.setValue('icone', defaultValues.icone);
    }
  }, [mode, defaultValues, form]);

  const handleSubmit = async (data: PersonaFormData) => {
    setLoading(true);

    try {
      if (mode === 'create') {
        // CREATE: não envia ID, ícone é obrigatório
        if (!data.icone) {
          toast.error('Ícone é obrigatório para criar uma nova persona');
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append('nome', data.nome);

        // Verifica se icone é FileList ou string (URL)
        if (data.icone instanceof FileList && data.icone[0]) {
          formData.append('icone', data.icone[0]);
        } else if (
          typeof data.icone === 'object' &&
          data.icone instanceof File
        ) {
          formData.append('icone', data.icone);
        }

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
        if (data.icone instanceof FileList && data.icone[0]) {
          formData.append('icone', data.icone[0]);
        } else if (data.icone instanceof File) {
          formData.append('icone', data.icone);
        }

        await updatePersona(formData);

        toast.success('Persona atualizada com sucesso!');
        onSuccess({
          ...defaultValues,
          ...data,
          icone:
            data.icone instanceof File || data.icone instanceof FileList
              ? URL.createObjectURL(
                  data.icone instanceof FileList ? data.icone[0] : data.icone,
                )
              : defaultValues.icone,
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-lg">
        <h3 className="text-xl font-semibold mb-6">
          {mode === 'edit' ? 'Editar Persona' : 'Adicionar Nova Persona'}
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

            {/* Ícone com ImageInput */}
            <FormField
              control={form.control}
              name="icone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Ícone {mode === 'create' && '*'}
                    {mode === 'edit' && ' (clique para alterar)'}
                  </FormLabel>
                  <FormControl>
                    <ImageInput
                      onChange={field.onChange}
                      value={field.value}
                      className="w-full"
                      height={120}
                    />
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
                  : 'Adicionar'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
