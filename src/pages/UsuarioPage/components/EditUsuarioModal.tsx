// src/pages/UsuariosPage/components/EditModal.tsx

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Pencil } from 'lucide-react';
import type { usuarioFormValues } from './usuarioForm/usuarioSchema';
import { toast } from 'sonner';
import { UsuarioForm } from './usuarioForm/usuarioForm';
import type { Secretaria } from '@/types/Secretaria';
import type { UsuarioPorId } from '@/types/Usuario';
import usuarioService from '@/services/usuariosService';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  secretarias: Secretaria[];
  usuario: UsuarioPorId;
}

export function EditUsuarioModal({
  open,
  onOpenChange,
  secretarias,
  usuario,
}: Props) {
  const secretariaDoUsuario = secretarias.find(
    (s) =>
      s.nome.trim().toLowerCase() === usuario.secretaria.trim().toLowerCase(),
  );

  const defaultValues = usuario
    ? {
        nome: usuario.nome,
        cpf: usuario.cpf,
        contato: usuario.contato,
        email: usuario.email,
        senha: usuario.senha,
        ativo: usuario.ativo,
        secretaria: secretariaDoUsuario!.id,
        perfil: usuario.perfil as 'ADMINISTRADOR' | 'COMUM',
      }
    : undefined;

  async function onSubmit(data: usuarioFormValues) {
    if (!usuario?.id) {
      toast.error('ID do usuário não fornecido para edição.');
      return;
    }

    try {
      await usuarioService.updateUsuario({ ...data, id: usuario.id });
      toast.success('Usuário atualizado com sucesso!');
      onOpenChange(false);
    } catch (error) {
      toast.error('Erro ao atualizar usuário.');
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Pencil /> Editar Usuário
          </DialogTitle>
        </DialogHeader>
        <UsuarioForm
          onSubmit={onSubmit}
          openChange={onOpenChange}
          secretarias={secretarias}
          isSubmitting={false}
          defaultValues={defaultValues}
        />
      </DialogContent>
    </Dialog>
  );
}
