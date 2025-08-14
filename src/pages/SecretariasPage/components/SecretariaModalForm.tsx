'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { secretariaSchema, type CreateSecretaria } from './secretariaSchema';
import { toast } from 'sonner';

const uploadSecretaria = async (data: CreateSecretaria) => {
  console.log('Enviando dados para a API:', data);
  await new Promise((resolve) => setTimeout(resolve, 1500));
  if (data.nome.toLowerCase() === 'erro') {
    throw new Error('Erro simulado na API ao tentar cadastrar.');
  }
};

interface SecretariaFormModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
}

export function SecretariaFormModal({
  isOpen,
  setIsOpen,
  onSuccess,
}: SecretariaFormModalProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateSecretaria>({
    resolver: zodResolver(secretariaSchema),
    defaultValues: {
      nome: '',
      sigla: '',
      visivel: true,
      ativo: true,
    },
  });

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const onSubmit = async (data: CreateSecretaria) => {
    setLoading(true);
    try {
      await uploadSecretaria(data);
      toast.success('Secretaria cadastrada com sucesso!');
      onSuccess();
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error?.message || 'Erro ao cadastrar a secretaria.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Cadastrar Secretaria</DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo para criar uma nova secretaria.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Secretaria de Educação"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sigla"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sigla</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: SEDUC" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-3 pt-2">
              <FormField
                control={form.control}
                name="visivel"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Visível</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Cadastrar'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
