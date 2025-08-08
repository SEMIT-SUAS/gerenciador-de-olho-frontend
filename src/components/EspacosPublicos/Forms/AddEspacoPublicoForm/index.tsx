import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  AddEspacoPublicoFormSchema,
  type AddEspacoPublicoFormValues,
} from './schema';
import { Input } from '@/components/ui/input';
import { MultipleImageInput } from '@/components/MutipleImageInput';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { SelectLocationInMap } from '../../../SelectLocationInMap';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import denunciasService from '@/services/denunciasService';
import espacoPublicoService from '@/services/espacoPublicoService';

interface AddEspacoPublicoFormProps {
  onSuccess: () => void;
}

export function AddEspacoPublicoForm({ onSuccess }: AddEspacoPublicoFormProps) {
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [position, setPosition] = useState<[number, number] | null>(null);

  const form = useForm({
    resolver: zodResolver(AddEspacoPublicoFormSchema),
    defaultValues: {
      name: '',
      addressRua: '',
      addressBairro: '',
      maxCapacity: '',
      startHour: '',
      endHour: '',
      visivel: true,
      files: [],
    },
  });

  useEffect(() => {
    if (position) {
      denunciasService
        .getAddressByCoordinates(position[0], position[1])
        .then((addressData) => {
          form.setValue('addressRua', addressData.rua);
          form.setValue('addressBairro', addressData.bairro);
        })
        .catch((error: any) => toast.error(error.message));
    }
  }, [position]);

  async function onSubmit(values: AddEspacoPublicoFormValues) {
    if (!position) return;

    try {
      setIsSubmittingForm(true);
      const formData = new FormData();
      formData.append('nome', values.name);
      formData.append('estado', 'Maranhão');
      formData.append('cidade', 'São Luís');
      formData.append('bairro', values.addressBairro);
      formData.append('rua', values.addressRua);
      formData.append('latitude', position[0].toString());
      formData.append('longitude', position[1].toString());
      formData.append('capacidade_maxima', values.maxCapacity.toString());
      formData.append('hora_inicio', values.startHour);
      formData.append('hora_fim', values.endHour);
      formData.append('visivel', values.visivel.toString());
      formData.append('ativo', 'true');

      values.files.forEach((file) => {
        formData.append('arquivos', file);
      });

      await espacoPublicoService.create(formData);
      onSuccess();
      toast.success('Espaço público cadastrado com sucesso!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmittingForm(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Quadra Poliesportiva Central"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="h-5" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxCapacity"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Capacidade Máxima</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage className="h-5" />
              </FormItem>
            )}
          />

          <FormItem className="flex flex-col">
            <FormLabel>Horário de Funcionamento</FormLabel>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="startHour"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="time" {...field} className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <span className="hidden h-10 items-center px-2 text-sm text-muted-foreground sm:flex">
                às
              </span>

              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="endHour"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="time" {...field} className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </FormItem>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold">Endereço</h2>
            <p>Selecione no mapa a localização do espaço público</p>
          </div>

          <div className="relative w-full h-[400px]">
            <SelectLocationInMap
              position={position}
              setPosition={setPosition}
            />
          </div>

          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="addressRua"
              render={({ field }) => (
                <FormItem className="flex flex-1 flex-col">
                  <FormLabel>Rua</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Informe a rua"
                      {...field}
                      disabled={true}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage className="h-5" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="addressBairro"
              render={({ field }) => (
                <FormItem className="flex flex-1 flex-col">
                  <FormLabel>Bairro</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Informe o bairro"
                      {...field}
                      disabled={true}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage className="h-5" />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="files"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fotos do espaço</FormLabel>
              <FormControl>
                <MultipleImageInput
                  onChange={field.onChange}
                  maxFiles={5}
                  className="w-full"
                />
              </FormControl>
              <FormMessage className="h-5" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="visivel"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Visível</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Se marcado, o espaço público será exibido automaticamente ao
                  ser criado
                </p>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full md:w-auto"
          disabled={isSubmittingForm}
        >
          {isSubmittingForm ? 'Cadastrando...' : 'Cadastrar Espaço Público'}
        </Button>
      </form>
    </Form>
  );
}
