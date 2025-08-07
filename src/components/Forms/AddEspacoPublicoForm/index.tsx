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
} from './types';
import { Input } from '@/components/ui/input';
import { MultipleImageInput } from '@/components/MutipleImageInput';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface AddEspacoPublicoFormProps {
  onSuccess: () => void;
}

export function AddEspacoPublicoForm({ onSuccess }: AddEspacoPublicoFormProps) {
  const form = useForm({
    resolver: zodResolver(AddEspacoPublicoFormSchema),
    defaultValues: {
      name: '',
      address: '',
      maxCapacity: '',
      startHour: '',
      endHour: '',
      visivel: true,
      files: [],
    },
  });

  async function onSubmit(values: AddEspacoPublicoFormValues) {
    console.log(values);
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

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input
                  placeholder="Informe o endereço"
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage className="h-5" />
            </FormItem>
          )}
        />

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

        <Button type="submit" className="w-full md:w-auto">
          Cadastrar Espaço Público
        </Button>
      </form>
    </Form>
  );
}
