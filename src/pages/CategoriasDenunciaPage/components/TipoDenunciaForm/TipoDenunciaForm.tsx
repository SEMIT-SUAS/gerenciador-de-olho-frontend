// Imports necessários - adicione os do Select
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { ImageInput } from '@/components/Forms/ImageInput';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

// Importe os tipos e o serviço corretos
import type { Secretaria } from '@/types/Secretaria';
import type { ServicoCategoria } from '@/types/CategoriaServico';
import {
  TipoDenunciaFormSchema,
  type TipoDenunciaFormValues,
} from './tipoDenunciaSchema';

interface TipoDenunciaFormProps {
  onSubmit: (data: TipoDenunciaFormValues) => void;
  isSubmitting: boolean;
  secretarias: Secretaria[];
  categorias: ServicoCategoria[];
}

export function TipoDenunciaForm({
  secretarias,
  categorias,
  onSubmit,
  isSubmitting,
}: TipoDenunciaFormProps) {
  const form = useForm<TipoDenunciaFormValues>({
    resolver: zodResolver(TipoDenunciaFormSchema),
    defaultValues: {
      nome: '',
      secretariaId: undefined,
      categoriaId: undefined,
      icone: undefined,
      visivel: true,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Tipo de Denúncia*</FormLabel>
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
          name="secretariaId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Secretaria Responsável*</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={String(field.value)}
              >
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma secretaria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {secretarias.map((secretaria) => (
                    <SelectItem
                      key={secretaria.id}
                      value={String(secretaria.id)}
                    >
                      {secretaria.sigla}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoriaId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria*</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={String(field.value)}
              >
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria.id} value={String(categoria.id)}>
                      {categoria.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="icone"
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
          name="visivel"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-4 bg-card">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Visível</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Exibir este tipo de denúncia no aplicativo
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
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Cadastrar Tipo de Denúncia
          </Button>
        </div>
      </form>
    </Form>
  );
}
