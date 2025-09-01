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
import {
  usuarioCreateSchema,
  usuarioEditSchema,
  type UsuarioCreateValues,
  type UsuarioEditValues,
} from './usuarioSchema';
import type { Secretaria } from '@/types/Secretaria';

// Componente para criação
interface UsuarioCreateFormProps {
  secretarias: Secretaria[];
  onSubmit: (data: UsuarioCreateValues) => void;
  isSubmitting: boolean;
  openChange: (open: boolean) => void;
  mode: 'create';
}

// Componente para edição
interface UsuarioEditFormProps {
  secretarias: Secretaria[];
  onSubmit: (data: UsuarioEditValues) => void;
  isSubmitting: boolean;
  openChange: (open: boolean) => void;
  defaultValues: UsuarioEditValues;
  mode: 'edit';
}

type UsuarioFormProps = UsuarioCreateFormProps | UsuarioEditFormProps;

export function UsuarioForm(props: UsuarioFormProps) {
  const { secretarias, onSubmit, isSubmitting, openChange, mode } = props;

  if (mode === 'create') {
    return (
      <UsuarioCreateForm
        secretarias={secretarias}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        openChange={openChange}
      />
    );
  }

  return (
    <UsuarioEditForm
      secretarias={secretarias}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      openChange={openChange}
      defaultValues={props.defaultValues}
    />
  );
}

// Componente interno para criação
function UsuarioCreateForm({
  secretarias,
  onSubmit,
  isSubmitting,
  openChange,
}: {
  secretarias: Secretaria[];
  onSubmit: (data: UsuarioCreateValues) => void;
  isSubmitting: boolean;
  openChange: (open: boolean) => void;
}) {
  const form = useForm<UsuarioCreateValues>({
    resolver: zodResolver(usuarioCreateSchema),
    defaultValues: {
      nome: '',
      cpf: '',
      contato: '',
      email: '',
      senha: '',
      ativo: true,
      secretaria: 0, // ou você pode usar 1 se for o mínimo
      perfil: 'COMUM',
    },
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
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <Input
                  placeholder="000.000.000-00"
                  disabled={isSubmitting}
                  autoComplete="off"
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
                  disabled={isSubmitting}
                  autoComplete="off"
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
                  disabled={isSubmitting}
                  autoComplete="off"
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
                disabled={isSubmitting}
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
                value={field.value}
                disabled={isSubmitting}
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
            Cadastrar
          </Button>
        </div>
      </form>
    </Form>
  );
}

// Componente interno para edição
function UsuarioEditForm({
  secretarias,
  onSubmit,
  isSubmitting,
  openChange,
  defaultValues,
}: {
  secretarias: Secretaria[];
  onSubmit: (data: UsuarioEditValues) => void;
  isSubmitting: boolean;
  openChange: (open: boolean) => void;
  defaultValues: UsuarioEditValues;
}) {
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
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <Input
                  placeholder="000.000.000-00"
                  disabled={true} // CPF não deve ser editável
                  autoComplete="off"
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
                  disabled={isSubmitting}
                  autoComplete="off"
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
              <FormLabel>
                Senha{' '}
                <span className="text-sm text-muted-foreground">
                  (opcional)
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Deixe em branco para manter a atual"
                  disabled={isSubmitting}
                  autoComplete="off"
                  readOnly
                  onFocus={(e) => e.currentTarget.removeAttribute('readonly')}
                  {...field}
                  value={field.value || ''}
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
                disabled={isSubmitting}
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
                value={field.value}
                disabled={isSubmitting}
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
            Salvar Alterações
          </Button>
        </div>
      </form>
    </Form>
  );
}
