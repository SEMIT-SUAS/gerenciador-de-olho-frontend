import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import type { usuarioFormValues } from './usuarioForm/usuarioSchema';
import usuarioService from '@/services/usuariosService';
import type { UsuarioModel } from '@/types/Usuario';
import { useState, type Dispatch, type SetStateAction } from 'react';
import { toast } from 'react-toastify';
import { UsuarioForm } from './usuarioForm/usuarioForm';
import type { Secretaria } from '@/types/Secretaria';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setUsuarios: Dispatch<SetStateAction<UsuarioModel[]>>;
  secretarias: Secretaria[];
  usuario: UsuarioModel;
}

export function EditUsuarioModal({
  open,
  onOpenChange,
  setUsuarios,
  secretarias,
  usuario,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(data: usuarioFormValues) {
    try {
      console.log('Dados enviados:', data);
      const novoUsuario = await usuarioService.cadastrarGerenciador(data);

      setUsuarios((prev) => [...prev, novoUsuario]);
      toast.success('Usuário cadastrado com sucesso!');

      onOpenChange(false);
    } catch (error: any) {
      console.error('Erro ao cadastrar usuário:', error);
      toast.error(error.message || 'Erro ao cadastrar usuário');
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Editar Usuário
          </DialogTitle>
          <DialogDescription>
            Cadastre um novo usuário no sistema. Preencha todos os campos.
          </DialogDescription>
        </DialogHeader>
        <UsuarioForm
          onSubmit={onSubmit}
          openChange={onOpenChange}
          secretarias={secretarias}
          isSubmitting={isSubmitting}
          defaultValues={usuario}
        />
      </DialogContent>
    </Dialog>
  );
}
