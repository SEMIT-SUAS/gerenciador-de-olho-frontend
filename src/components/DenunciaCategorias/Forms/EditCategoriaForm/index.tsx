import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { CategoriaDenunciaModel } from '@/types/CategoriaDenuncia';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, type Dispatch, type SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import {
  EditCategoriaFormSchema,
  type EditCategoriaFormValues,
} from './schema';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageInput } from '@/components/Forms/ImageInput';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import categoriaService from '@/services/categoriaService';

interface EditCategoriaFormProps {
  onSuccess: () => void;
  category: CategoriaDenunciaModel;
  setCategorias: Dispatch<SetStateAction<CategoriaDenunciaModel[] | null>>;
}

export function EditCategoriaForm({
  onSuccess,
  category,
  setCategorias,
}: EditCategoriaFormProps) {
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const form = useForm({
    resolver: zodResolver(EditCategoriaFormSchema),
    defaultValues: {
      name: category.nome,
      description: category.descricao,
      cor: category.cor,
      icon: undefined,
      fixed: category.destaque,
    },
  });

  async function handleEditCategoria(values: EditCategoriaFormValues) {
    const formData = new FormData();

    if (values.name !== category.nome) {
      formData.append('nome', values.name);
    }

    if (values.description && values.description !== category.descricao) {
      formData.append('descricao', values.description);
    }

    if (values.cor !== category.cor) {
      formData.append('cor', values.cor);
    }

    if (values.icon) {
      formData.append('icone', values.icon);
    }

    if (values.fixed !== category.destaque) {
      formData.append('destaque', String(values.fixed));
    }

    const formEntrities = Array.from(formData.keys());

    if (formEntrities.length === 0) {
      toast.error('Nenhuma informação foi alterada');
      return;
    }

    formData.append('id', String(category.id));

    try {
      setIsSubmittingForm(true);
      const categoryDataUpdated = await categoriaService.update(formData);

      setCategorias(
        (prev) =>
          prev?.map((prevCat) =>
            prevCat.id === category.id ? categoryDataUpdated : prevCat,
          ) || null,
      );

      toast.success('Categoria editada com sucesso');
      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmittingForm(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleEditCategoria)}
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
                  initialImageUrl={category.icone}
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
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-4 bg-card">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Destaque</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Exibir como categoria destacada
                </p>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            className="w-full md:w-auto px-8"
            size="lg"
            disabled={isSubmittingForm}
          >
            {isSubmittingForm && <Loader2 className="w-4 h-4 animate-spin" />}
            Editar Categoria
          </Button>
        </div>
      </form>
    </Form>
  );
}
