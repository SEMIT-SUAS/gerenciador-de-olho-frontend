import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { maskCPF, maskPhone, unmaskValue } from '@/lib/masks';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { usuarioEditSchema, type UsuarioEditValues } from './usuarioSchemaEdit';
import type { Secretaria } from '@/types/Secretaria';

interface UsuarioEditFormProps {
  secretarias: Secretaria[];
  onSubmit: (data: UsuarioEditValues) => void;
  isSubmitting: boolean;
  openChange: (open: boolean) => void;
  defaultValues: UsuarioEditValues;
}

export function UsuarioEditForm({
  secretarias,
  onSubmit,
  isSubmitting,
  openChange,
  defaultValues,
}: UsuarioEditFormProps) {
  const form = useForm<UsuarioEditValues>({
    resolver: zodResolver(usuarioEditSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form
        autoComplete="off"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nome completo"
                  disabled={isSubmitting}
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
          name="contato"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contato</FormLabel>
              <FormControl>
                <Input
                  placeholder="(00) 00000-0000"
                  disabled={isSubmitting}
                  autoComplete="off"
                  value={maskPhone(field.value || '')}
                  onChange={(e) => {
                    const masked = maskPhone(e.target.value);
                    const unmasked = unmaskValue(masked);
                    field.onChange(unmasked);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  inputMode="email"
                  placeholder="seu@email.com"
                  disabled={true} // Email não editável
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => openChange(false)}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Alterações
          </Button>
        </div>
      </form>
    </Form>
  );
}
