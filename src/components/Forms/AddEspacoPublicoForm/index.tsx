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

interface AddEspacoPublicoFormProps {
  onSuccess: () => void;
}

export function AddEspacoPublicoForm({ onSuccess }: AddEspacoPublicoFormProps) {
  const form = useForm({
    resolver: zodResolver(AddEspacoPublicoFormSchema),
    defaultValues: {},
  });

  async function onSubmit(values: AddEspacoPublicoFormValues) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nome do espaço público"
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
