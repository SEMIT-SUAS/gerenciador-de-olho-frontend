import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState, type Dispatch, type SetStateAction } from 'react';
import type { BannerModel } from '@/types/Banner';
import { AddBannerFormSchema, type AddBannerFormValues } from './types';
import { Loading } from '@/components/Loading/Loading';
import { ImageInput } from '@/components/Forms/ImageInput';
import { BannerService } from '@/services/bannersService';
import { Switch } from '@/components/ui/switch';

type AddABannerFormProps = {
  setBanners: Dispatch<SetStateAction<BannerModel[] | null>>;
  onSuccess: () => void;
};

export function AddABannerForm({ setBanners, onSuccess }: AddABannerFormProps) {
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const form = useForm<AddBannerFormValues>({
    resolver: zodResolver(AddBannerFormSchema),
    defaultValues: {
      name: '',
      link: '',
      image: undefined,
      visivel: true,
    },
  });

  async function onSubmit(data: AddBannerFormValues) {
    try {
      setIsSubmittingForm(true);

      const formData = new FormData();
      formData.append('nome', data.name);
      formData.append('link', data.link);
      formData.append('imagem', data.image);
      formData.append('visivel', `${data.visivel}`);
      formData.append('ativo', 'true');

      const newBanner = await new BannerService().upload(formData);
      setBanners((prev) => {
        if (!prev) return null;
        return [...prev, newBanner];
      });

      toast.success(`Banner "${newBanner.nome}" criado com sucesso!`);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmittingForm(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('space-y-6')}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nome do banner"
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
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link de destino</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://exemplo.com"
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
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imagem do banner</FormLabel>
                <FormControl>
                  <ImageInput
                    value={field.value}
                    onChange={field.onChange}
                    className="w-full"
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
              <FormItem className="flex items-center justify-between border p-3 rounded-md">
                <div>
                  <FormLabel className="text-base">Visível</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Se marcado, o banner será exibido automaticamente ao ser
                    cadastrado
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
        </div>
        <div className="flex justify-end pt-5 gap-4">
          <Button
            variant="outline"
            className="px-8"
            onClick={() => window.history.back()}
            type="button"
          >
            Cancelar
          </Button>

          <Button type="submit" disabled={isSubmittingForm}>
            {isSubmittingForm ? (
              <div className="mx-auto">
                <Loading className="size-3" />
              </div>
            ) : (
              'Adicionar Banner'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
