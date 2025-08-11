import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { BannerModel } from '@/types/Banner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, type Dispatch, type SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { EditBannerFormSchema, type EditBannerFormValues } from './types';
import { ImageInput } from '@/components/Forms/ImageInput';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Loading } from '@/components/Loading/Loading';
import bannersService from '@/services/bannersService';

type EditBannerForm = {
  banner: BannerModel;
  setBanners: Dispatch<SetStateAction<BannerModel[] | null>>;
  onSuccess: () => void;
};

export function EditBannerForm({
  banner,
  setBanners,
  onSuccess,
}: EditBannerForm) {
  const [isSubmitingEditBannerForm, setIsSubmitingEditBannerForm] =
    useState(false);

  const form = useForm({
    resolver: zodResolver(EditBannerFormSchema),
    defaultValues: {
      name: banner.nome,
      link: banner.link,
      image: undefined,
    },
  });

  async function onSubmitEditBannerForm(values: EditBannerFormValues) {
    const formData = new FormData();

    if (values.name && banner.nome !== values.name) {
      formData.append('nome', values.name);
    }

    if (values.link && banner.link !== values.link) {
      formData.append('link', values.link);
    }

    if (values.image) {
      formData.append('imagem', values.image);
    }

    const formEntrities = Array.from(formData.keys());

    if (formEntrities.length === 0) {
      toast.error('Nenhuma informação foi alterada');
      return;
    }

    formData.append('id', `${banner.id}`);

    try {
      setIsSubmitingEditBannerForm(true);
      const dataUpdated = await bannersService.update(formData);

      setBanners(
        (prev) =>
          prev?.map((prevBanner) => {
            if (prevBanner.id === banner.id) {
              return dataUpdated;
            }

            return prevBanner;
          }) ?? null,
      );

      toast.success('Banner editado com sucesso');
      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitingEditBannerForm(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitEditBannerForm)}
        className={cn('space-y-6')}
      >
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
                <FormLabel>Link</FormLabel>
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
                    initialImageUrl={banner.imagem}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitingEditBannerForm}
          >
            {isSubmitingEditBannerForm ? (
              <div className="mx-auto">
                <Loading className="size-3" />
              </div>
            ) : (
              'Editar Banner'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
