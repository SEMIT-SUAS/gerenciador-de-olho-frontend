import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nome completo"
                  // O campo fica desabilitado se não estiver no modo de edição
                  disabled={isSubmitting || !isEditing} 
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <Input
                  placeholder="000.000.000-00"
                  // É uma boa prática desabilitar campos de identificação na edição
                  disabled={isSubmitting || isEditing} 
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
                  placeholder="(99) 99999-9999"
                  // O campo fica desabilitado se não estiver no modo de edição
                  disabled={isSubmitting || !isEditing} 
                  {...field}
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
                  type="email"
                  placeholder="seu@email.com"
                  // É uma boa prática desabilitar campos de identificação na edição
                  disabled={isSubmitting || isEditing}
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
                  // Senha sempre desabilitada na edição (requer modal separado)
                  disabled={isSubmitting || isEditing} 
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