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
import { usuarioSchema, type usuarioFormValues } from './usuarioSchema';
import type { Secretaria } from '@/types/Secretaria';

interface UsuarioFormProps {
  secretarias: Secretaria[];
  onSubmit: (data: usuarioFormValues) => void;
  isSubmitting: boolean;
  openChange: (open: boolean) => void;
  defaultValues?: usuarioFormValues;
}

export function UsuarioForm({
  secretarias,
  onSubmit,
  isSubmitting,
  openChange,
  defaultValues,
}: UsuarioFormProps) {
  const isEditing = !!defaultValues;

  const form = useForm<usuarioFormValues>({
    resolver: zodResolver(usuarioSchema),
    defaultValues: defaultValues || {
      nome: '',
      cpf: '',
      contato: '',
      email: '',
      senha: '',
      ativo: true,
      secretaria: undefined,
      perfil: 'COMUM',
    },
  });

  return (
    <Form {...form}>
      <form
        autoComplete="off" // (1) form off
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
                  autoComplete="off" // (1) input off
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo CPF com máscara */}
        <FormField
          control={form.control}
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <Input
                  placeholder="000.000.000-00"
                  disabled={isSubmitting || isEditing}
                  autoComplete="off" // (1)
                  {...field}
                  value={maskCPF(field.value || '')}
                  onChange={(e) => {
                    const masked = maskCPF(e.target.value);
                    const unmasked = unmaskValue(masked);
                    field.onChange(unmasked);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo Contato com máscara */}
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
                  autoComplete="off" // (1)
                  {...field}
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
                  // (3) evitar heurística: não usar type="email"
                  type="text"
                  inputMode="email"
                  placeholder="seu@email.com"
                  disabled={isSubmitting || isEditing}
                  autoComplete="off" // (1)
                  // (2) bloquear autofill até foco
                  readOnly
                  onFocus={(e) => e.currentTarget.removeAttribute('readonly')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="senha"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="•••••••"
                  disabled={isSubmitting || isEditing}
                  autoComplete="off" // (1)
                  // (2) bloquear autofill até foco
                  readOnly
                  onFocus={(e) => e.currentTarget.removeAttribute('readonly')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="secretaria"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Secretaria Responsável*</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value ? String(field.value) : ''}
                disabled={isSubmitting || isEditing}
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
          name="perfil"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Perfil</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isSubmitting || isEditing}
              >
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um perfil" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ADMINISTRADOR">Administrador</SelectItem>
                  <SelectItem value="COMUM">Comum</SelectItem>
                </SelectContent>
              </Select>
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
            {isEditing ? 'Salvar Alterações' : 'Cadastrar'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
