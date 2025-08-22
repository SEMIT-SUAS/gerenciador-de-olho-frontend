import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useMapActions } from '@/context/MapActions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CreateAcaoFormSchema, type CreateAcaoFormValues } from './schema';
import { Button } from '@/components/ui/button';
import { useOcorrencias } from '@/context/OcorrenciasContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { IconTrash } from '@tabler/icons-react';
import { useFilters } from '@/context/FiltersContext';

export function CriarAcaoForm() {
  const form = useForm({
    resolver: zodResolver(CreateAcaoFormSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      observacao: undefined,
      secretariaId: undefined,
    },
  });

  const { secretarias } = useOcorrencias();
  const {
    setSalvarDenunciasOnClick,
    denunciasSelecionas,
    toggleDenunciaSelecionadas,
  } = useMapActions();
  const {
    setIsVisibleDenunciasInMap,
    setIsVisibleAcoesInMap,
    setFiltroStatusDenuncia,
    fetchDataFiltrada,
  } = useFilters();

  useEffect(() => {
    setFiltroStatusDenuncia('Aberto');
    setIsVisibleDenunciasInMap(true);
    setSalvarDenunciasOnClick(true);
    setIsVisibleAcoesInMap(false);

    fetchDataFiltrada();

    return () => {
      setIsVisibleAcoesInMap(true);
      setSalvarDenunciasOnClick(false);
    };
  }, []);

  async function handleCreateAcao(values: CreateAcaoFormValues) {
    console.log('Dados do formulário:', values);
  }

  return (
    <Form {...form}>
      <form
        className="space-y-4 h-full"
        onSubmit={form.handleSubmit(handleCreateAcao)}
      >
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome*</FormLabel>
              <FormControl>
                <Input placeholder="Informe um nome" {...field} />
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
              <FormLabel>Secretaria*</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value ? String(field.value) : ''}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma secretaria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {secretarias.map((sec) => (
                    <SelectItem
                      key={`create-acao-form-secretaria-select-${sec.id}`}
                      value={String(sec.id)}
                    >
                      {sec.sigla}
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
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição*</FormLabel>
              <FormControl>
                <Textarea placeholder="Informe os detalhes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="observacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observação (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Informe uma observação (opcional)"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Denúncias Selecionadas</CardTitle>
            <CardDescription>
              As denúncias abaixo foram selecionadas no mapa para esta ação.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {denunciasSelecionas.length > 0 ? (
              <div className="flex flex-col gap-2">
                {denunciasSelecionas.map((denuncia) => (
                  <Card>
                    <CardHeader className="flex items-center justify-between">
                      <CardTitle>{denuncia.nomeTipoDenuncia}</CardTitle>
                      <CardDescription>
                        <Button
                          size="icon"
                          onClick={() => toggleDenunciaSelecionadas(denuncia)}
                        >
                          <IconTrash />
                        </Button>
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhuma denúncia selecionada no mapa.
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="w-[50%]">
            Criar ação
          </Button>
        </div>
      </form>
    </Form>
  );
}
