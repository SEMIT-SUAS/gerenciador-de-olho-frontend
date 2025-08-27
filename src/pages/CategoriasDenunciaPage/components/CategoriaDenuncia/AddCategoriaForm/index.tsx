import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { AddCategoriaFormSchema, type AddCategoriaFormValues } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { useState, type Dispatch, type SetStateAction } from 'react';
import type { CategoriaDenunciaModel } from '@/types/CategoriaDenuncia';
import { Textarea } from '@/components/ui/textarea';
import { ImageInput } from '@/components/Forms/ImageInput';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { CategoriaDenunciaService } from '@/services/CategoriaDenunciaService';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface AddCategoriaFormProps {
  setCategorias: Dispatch<SetStateAction<CategoriaDenunciaModel[] | null>>;
  onSuccess: () => void;
}

export function AddCategoriaForm({
  setCategorias,
  onSuccess,
}: AddCategoriaFormProps) {
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const form = useForm({
    resolver: zodResolver(AddCategoriaFormSchema),
    defaultValues: {
      name: '',
      cor: '',
      fixed: false,
      visivel: true,
      icon: undefined,
    },
  });

  async function handleCreateCategoria(values: AddCategoriaFormValues) {
    const formData = new FormData();
    formData.append('nome', values.name);
    if (values.description) {
      formData.append('descricao', values.description);
    }
    formData.append('icone', values.icon);
    formData.append('cor', values.cor);
    formData.append('visivel', values.visivel.toString());
    formData.append('destaque', values.fixed.toString());
    formData.append('ativo', true.toString());

    try {
      setIsSubmittingForm(true);
      const categorySavedData = await new CategoriaDenunciaService().create(
        formData,
      );

      setCategorias((prevCategories) => {
        if (!prevCategories) {
          return null;
        }

        return [...prevCategories, categorySavedData];
      });

      toast('Categoria adicionada com sucesso');
      form.reset();
      onSuccess();
    } catch (error: any) {
      if (error.message === 'Não foi possível criar uma categoria') {
        form.setError('name', {
          message: 'Categoria já cadastrada.',
        });

        return;
      }

      toast.error(error.message);
    } finally {
      setIsSubmittingForm(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateCategoria)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome*</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Buraco na via"
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Para denúncias com buraco na rua"
                  className="min-h-[38px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cor*</FormLabel>
              <div className="flex items-center gap-3">
                <FormControl>
                  <Input
                    type="color"
                    className="w-16 h-10 p-1 cursor-pointer"
                    {...field}
                  />
                </FormControl>
                <Input
                  placeholder="Ex: #3b82f6"
                  autoComplete="off"
                  className="flex-1"
                  value={field.value}
                  onChange={field.onChange}
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ícone*</FormLabel>
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
        <FormField
          control={form.control}
          name="fixed"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between border p-3 rounded-md bg-card">
              <div>
                <FormLabel className="text-base">Destaque</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Exibir como categoria destacada
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmittingForm}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="visivel"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between border p-3 rounded-md bg-card">
              <div>
                <FormLabel className="text-base">Visível</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Exibir esta categoria no aplicativo
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmittingForm}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <div className="flex justify-end pt-5 gap-4">
            <Button
              variant="outline"
              className="px-8"
              onClick={() => window.history.back()}
              type="button"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="w-full md:w-auto px-8"
              size="lg"
              disabled={isSubmittingForm}
            >
              {isSubmittingForm && <Loader2 className="w-4 h-4 animate-spin" />}
              Adicionar Categoria
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
