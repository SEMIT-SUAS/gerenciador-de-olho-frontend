// src/components/forms/PortalForm.tsx

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState, type Dispatch, type SetStateAction } from 'react';
import { toast } from 'react-toastify';

import { portaisSchema, type PortaisSchema } from './portaisSchema';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Loading } from '@/components/Loading/Loading';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { Portais } from '@/types/Portais';

type PortalFormProps = {
  setPortais?: Dispatch<SetStateAction<Portais[]>>;

  defaultValues?: Portais;
  onSubmit: (data: PortaisSchema) => void;
  isSubmitting: boolean;
};

export function PortalForm({
  defaultValues,
  onSubmit,
  isSubmitting,
}: PortalFormProps) {
  const form = useForm<PortaisSchema>({
    resolver: zodResolver(portaisSchema),
    defaultValues: defaultValues || {
      nome: '',
      categoria: undefined,
      destaque: false,
      link: '',
      visivel: true,
      ativo: true,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('space-y-6')}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Portal</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: G1, UOL..." {...field} />
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
                <FormLabel>Link do Portal</FormLabel>
                <FormControl>
                  <Input placeholder="https://exemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                {/* O componente Select principal controla o estado */}
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    {/* O SelectTrigger é o que o usuário vê e clica */}
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  {/* O SelectContent é o menu dropdown que aparece */}
                  <SelectContent>
                    <SelectItem value="Cidadão">Cidadão</SelectItem>
                    <SelectItem value="Servidor">Servidor</SelectItem>
                    <SelectItem value="Empresa">Empresa</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Este campo é opcional.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="destaque"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Destaque</FormLabel>
                  <FormDescription>
                    Marcar para destacar este portal na página inicial.
                  </FormDescription>
                </div>
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
                  <FormDescription>
                    Se desmarcado, o portal não será exibido para os usuários.
                  </FormDescription>
                </div>
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

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loading className="size-4" /> : 'Salvar Portal'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
