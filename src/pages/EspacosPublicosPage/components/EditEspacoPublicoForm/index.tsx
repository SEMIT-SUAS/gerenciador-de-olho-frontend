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
import { Input } from '@/components/ui/input';
import { MultipleImageInput } from '@/components/MutipleImageInput';
import { Button } from '@/components/ui/button';
import { SelectLocationInMap } from '../../../../components/SelectLocationInMap';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AddressService } from '@/services/AddressService';
import type { EspacoPublicoModel } from '@/types/EspacoPublico';
import {
  EditEspacoPublicoFormSchema,
  type EditEspacoPublicoFormValues,
} from './schema';
import { espacoPublicoService } from '@/services/espacoPublicoService';
import { useParams } from 'react-router-dom';

interface EditEspacoPublicoFormProps {
  espacoPublico: EspacoPublicoModel;
  onSuccess: () => void;
}

export function EditEspacoPublicoForm({
  espacoPublico,
  onSuccess,
}: EditEspacoPublicoFormProps) {
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [position, setPosition] = useState<[number, number]>([
    espacoPublico.latitude,
    espacoPublico.longitude,
  ]);
  const [deletedFiles, setDeletedFiles] = useState<string[] | undefined>([]);
  // const [files, setFiles] = useState<string[] | undefined>([]);

  // setFiles(espacoPublico.arquivos);

  const { id } = useParams();

  const form = useForm({
    resolver: zodResolver(EditEspacoPublicoFormSchema),
    defaultValues: {
      name: espacoPublico.nome,
      addressRua: espacoPublico.rua,
      addressBairro: espacoPublico.bairro,
      maxCapacity: espacoPublico.capacidadeMaxima,
      startHour: espacoPublico.horaInicio,
      endHour: espacoPublico.horaFim,
      files: undefined,
      visivel: espacoPublico.visivel,
    },
  });

  function removeURL(url: string) {
    const urlSemParams = url.split('?')[0];
    const ultimoIndiceBarra = urlSemParams.lastIndexOf('/');
    const fileName = urlSemParams.substring(ultimoIndiceBarra + 1);
    return fileName;
  }

  if (deletedFiles && deletedFiles.length > 0) {
    espacoPublico.arquivos = espacoPublico.arquivos.filter(
      (url) => !deletedFiles.includes(url),
    );
  }

  useEffect(() => {
    if (position) {
      AddressService.getAddressByCoordinates(position[0], position[1])
        .then((addressData) => {
          form.setValue('addressRua', addressData.rua);
          form.setValue('addressBairro', addressData.bairro);
        })
        .catch((error: any) => toast.error(error.message));
    }
  }, [position]);

  async function onSubmit(espacoPublico: EditEspacoPublicoFormValues) {
    try {
      setIsSubmittingForm(true);
      const formData = new FormData();
      formData.append('id', id!);
      formData.append('nome', espacoPublico.name);
      formData.append('estado', 'Maranhão');
      formData.append('cidade', 'São Luís');
      formData.append('bairro', espacoPublico.addressBairro);
      formData.append('rua', espacoPublico.addressRua);
      formData.append('latitude', position[0].toString());
      formData.append('longitude', position[1].toString());
      formData.append(
        'capacidade_maxima',
        espacoPublico.maxCapacity.toString(),
      );
      formData.append('hora_inicio', espacoPublico.startHour);
      formData.append('hora_fim', espacoPublico.endHour);
      formData.append('ativo', 'true');

      espacoPublico.files?.forEach((file) => {
        formData.append('arquivos', file);
      });

      if (deletedFiles && deletedFiles.length > 0) {
        await Promise.all(
          deletedFiles.map((file) =>
            espacoPublicoService.deleteFile(id!, removeURL(file)),
          ),
        );
      }

      await espacoPublicoService.update(formData);
      onSuccess();
      toast.success('Espaço público atualizado com sucesso!');
    } catch (error: any) {
      alert(error.message);
      toast.error(error.message);
    } finally {
      setDeletedFiles(undefined);
      setIsSubmittingForm(false);
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
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
                        <Input
                          type="time"
                          {...field}
                          className="w-full time-input-no-icon"
                        />
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
                        <Input
                          type="time"
                          {...field}
                          className="w-full time-input-no-icon"
                        />
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
                  initialImageUrls={espacoPublico.arquivos}
                  maxFiles={5}
                  className="w-full"
                  setDeletedFiles={setDeletedFiles}
                  deletedFiles={deletedFiles}
                />
              </FormControl>
              <FormMessage className="h-5" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full md:w-auto"
          disabled={isSubmittingForm}
        >
          {isSubmittingForm ? 'Editando...' : 'Editar Espaço Público'}
        </Button>
      </form>
    </Form>
  );
}
