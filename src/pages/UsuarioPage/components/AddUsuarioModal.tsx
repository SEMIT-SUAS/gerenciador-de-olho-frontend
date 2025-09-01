import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useState, type Dispatch, type SetStateAction } from 'react';
import { toast } from 'sonner';

import { UsuarioForm } from './usuarioForm/usuarioForm';
import usuarioService from '@/services/usuariosService';

import type { UsuarioModel } from '@/types/Usuario';
import type { Secretaria } from '@/types/Secretaria';
import type { UsuarioCreateValues } from './usuarioForm/usuarioSchema';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setUsuarios: Dispatch<SetStateAction<UsuarioModel[]>>;
  secretarias: Secretaria[];
  onUserCreated?: () => void; // callback opcional para refetch
}

export function AddUsuarioModal({
  open,
  onOpenChange,
  setUsuarios,
  secretarias,
  onUserCreated,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Função tipada corretamente apenas para criação
  async function onSubmit(data: UsuarioCreateValues) {
    try {
      setIsSubmitting(true);

      const novoUsuario = await usuarioService.cadastrarGerenciador(data);

      setUsuarios((prev) => (prev ? [...prev, novoUsuario] : [novoUsuario]));

      toast.success('Usuário cadastrado com sucesso!');

      // Callback opcional para refetch
      if (onUserCreated) {
        onUserCreated();
      }

      onOpenChange(false);
    } catch (error: any) {
      console.error('Erro ao cadastrar usuário:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Erro ao cadastrar usuário.';

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Previne fechamento durante submit
  function handleOpenChange(open: boolean) {
    if (!isSubmitting) {
      onOpenChange(open);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" /> Adicionar Usuário
          </DialogTitle>
          <DialogDescription>
            Cadastre um novo usuário no sistema.
          </DialogDescription>
        </DialogHeader>

        <UsuarioForm
          mode="create"
          secretarias={secretarias}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
          openChange={onOpenChange}
        />
      </DialogContent>
    </Dialog>
  );
}
