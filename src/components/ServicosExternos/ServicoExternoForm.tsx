import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  servicoSchema,
  type ServicoSchema,
  type ServicoSchemaOutput,
} from './schemaServicoExterno';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Loading } from '../Loading/Loading';

type ServicoExternoFormProps = {
  defaultValues?: ServicoSchemaOutput;
  onSubmit: (data: ServicoSchema) => void;
  isSubmitting: boolean;
};

export function ServicoExternoForm({
  defaultValues,
  isSubmitting,
  onSubmit,
}: ServicoExternoFormProps) {
  const form = useForm<ServicoSchema>({
    resolver: zodResolver(servicoSchema),
    defaultValues: defaultValues || {
      nome: '',
      imagem: undefined,
      visivel: true,
      ativo: true,
    },
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do serviço" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imagem"
              render={({
                field: { value, onChange, ...fieldProps },
              }: {
                field: {
                  value: string | File | undefined;
                  onChange: (v: File | undefined) => void;
                };
              }) => (
                <FormItem>
                  <FormLabel>Imagem</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          onChange(file || undefined);
                        }}
                        {...fieldProps}
                      />
                      Mostrar imagem atual no modo edição
                      {/* {mode === 'edit' &&
                        typeof value === 'string' &&
                        value && (
                          <div className="text-sm text-blue-600 bg-blue-100 p-2 rounded">
                            Imagem atual:{' '}
                            <span className="font-medium">
                              {value.split('/').pop()}
                            </span>
                            <div className="text-xs text-blue-500 mt-1">
                              Selecione um novo arquivo para substituir
                            </div>
                          </div>
                        )} */}
                      {/* Mostrar novo arquivo selecionado */}
                      {/* {value instanceof File && (
                        <div className="text-sm text-green-600 bg-green-100 p-2 rounded">
                          Novo arquivo selecionado:{' '}
                          <span className="font-medium">{value.name}</span>
                        </div>
                      )} */}
                    </div>
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
                    <div className="text-sm text-gray-500">
                      Aparece para os usuários no portal
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Ativo */}
            <FormField
              control={form.control}
              name="ativo"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between border p-3 rounded-md">
                  <div>
                    <FormLabel className="text-base">Ativo</FormLabel>
                    <div className="text-sm text-gray-500">
                      Se desativado, não poderá ser utilizado
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Botões */}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                // onClick={() => {() => void}}
                // disabled={loading}
              >
                Cancelar
              </Button>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loading className="size-4" />
                ) : (
                  'Salvar Portal'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
