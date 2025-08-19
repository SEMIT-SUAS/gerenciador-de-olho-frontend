// import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, Plus } from 'lucide-react';

import type { UsuarioLogin } from '@/types/Usuario';
import usuarioService from '@/services/usuariosService';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { z } from 'zod';

const cadastroSchema = z.object({
  nome: z
    .string()
    .min(2, { message: 'O nome deve ter no mínimo 2 caracteres.' })
    .max(100, { message: 'O nome deve ter no máximo 100 caracteres.' }),
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  senha: z
    .string()
    .min(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
    .max(50, { message: 'A senha deve ter no máximo 50 caracteres.' }),
});

type CadastroFormValues = z.infer<typeof cadastroSchema>;

interface AddUsuarioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setUsuarios: Dispatch<SetStateAction<UsuarioLogin[]>>;
}

export function RegisterForm({
  open,
  onOpenChange,
  setUsuarios,
}: AddUsuarioModalProps) {
  const form = useForm<CadastroFormValues>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      nome: '',
      email: '',
      senha: '',
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: CadastroFormValues) {
    try {
      const novoUsuario = await usuarioService.cadastrarGerenciador(data);

      setUsuarios((prev) => [...prev, novoUsuario]);

      toast.success('Usuário cadastrado com sucesso!');

      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      console.error('Erro ao cadastrar usuário:', error);
      toast.error(error.message || 'Erro ao cadastrar usuário');
    }
  }

  function handleClose() {
    onOpenChange(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Adicionar Usuário
          </DialogTitle>
          <DialogDescription>
            Cadastre um novo usuário no sistema. Preencha todos os campos
            obrigatórios.
          </DialogDescription>
        </DialogHeader>

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
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
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
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Cadastrar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
