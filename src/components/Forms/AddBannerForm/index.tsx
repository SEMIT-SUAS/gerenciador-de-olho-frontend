import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AddBannerFormSchema, type AddBannerFormValues } from './types';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  useCallback,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { IconImageInPicture, IconX } from '@tabler/icons-react';
import bannersService from '@/services/bannersService';
import type { BannerModel } from '@/types/Banner';

type AddBannerFormProps = {
  setBanners: Dispatch<SetStateAction<BannerModel[] | null>>;
  onSuccess: () => void;
};

export function AddBannerForm({ setBanners, onSuccess }: AddBannerFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const form = useForm<AddBannerFormValues>({
    resolver: zodResolver(AddBannerFormSchema),
    defaultValues: {
      name: '',
      link: '',
      image: undefined,
    },
  });

  const handleImageChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      fieldChange: (file: File) => void,
    ) => {
      e.preventDefault();
      const file = e.target.files?.[0];

      if (!file) return;

      if (!file.type.includes('image')) {
        toast.error('Por favor, envie um arquivo de imagem');
        return;
      }

      fieldChange(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result?.toString() || null);
      };
      reader.readAsDataURL(file);
    },
    [],
  );

  async function onSubmit(data: AddBannerFormValues) {
    try {
      const formData = new FormData();
      formData.append('nome', data.name);
      formData.append('imagem', data.image);
      formData.append('link', data.link);
      formData.append('visivel', false.toString());
      formData.append('ativo', true.toString());

      const newBanner = await bannersService.upload(formData);

      setBanners((prev) => [...(prev ?? []), newBanner]);
      toast.success(`Banner "${newBanner.nome}" criado com sucesso!`);
      onSuccess();
    } catch (error: any) {
      console.error('Error creating banner:', error);
      toast.error(error.message);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('space-y-6')}>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Detalhes do Banner
        </h4>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do banner" {...field} />
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
                  <Input placeholder="https://exemplo.com" {...field} />
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

                {imagePreview ? (
                  <div className="relative group">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        field.onChange(undefined);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <IconX className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <FormControl>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <IconImageInPicture className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">
                            Clique para enviar ou arraste uma imagem
                          </p>
                          <p className="text-xs text-gray-400">
                            Formatos suportados: JPG, PNG, GIF
                          </p>
                        </div>
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageChange(e, field.onChange)}
                        />
                      </label>
                    </div>
                  </FormControl>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full">
          Criar Banner
        </Button>
      </form>
    </Form>
  );
}
