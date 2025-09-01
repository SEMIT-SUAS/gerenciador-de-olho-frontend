import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { UsuarioForm } from './usuarioForm/usuarioForm';
import type { Secretaria } from '@/types/Secretaria';
import type { UsuarioPorId } from '@/types/Usuario';
import usuarioService from '@/services/usuariosService';
import { type UsuarioEditValues } from './usuarioForm/usuarioSchema';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  secretarias: Secretaria[];
  usuario: UsuarioPorId;
  onUserUpdated?: () => void; // callback para refetch dos dados
}

export function EditUsuarioModal({
  open,
  onOpenChange,
  secretarias,
  usuario,
  onUserUpdated,
}: Props) {
  // localizar a secretaria do usuário por nome (case-insensitive)
  const secretariaDoUsuario = secretarias.find(
    (s) =>
      s.nome.trim().toLowerCase() === usuario.secretaria.trim().toLowerCase(),
  );

  // defaultValues para edição — senha como undefined (não obriga troca)
  const defaultValues: UsuarioEditValues = {
    nome: usuario.nome,
    cpf: usuario.cpf,
    contato: usuario.contato,
    email: usuario.email,
    senha: undefined, // importante para não validar no editar
    ativo: usuario.ativo,
    secretaria: secretariaDoUsuario?.id || 1, // fallback para valor válido
    perfil: (usuario.perfil as 'ADMINISTRADOR' | 'COMUM') || 'COMUM',
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Função de submit tipada corretamente para edição
  async function onSubmit(data: UsuarioEditValues): Promise<void> {
    if (!usuario?.id) {
      toast.error('ID do usuário não fornecido para edição.');
      return;
    }

    try {
      setIsSubmitting(true);

      // Se senha estiver vazia ou undefined, remove ela dos dados
      if (!data.senha || data.senha.trim().length === 0) {
        delete data.senha;
      }

      await usuarioService.updateUsuario({ ...data, id: usuario.id });

      toast.success('Usuário atualizado com sucesso!');

      // Callback para refetch dos dados na lista
      if (onUserUpdated) {
        onUserUpdated();
      }

      onOpenChange(false);
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error);

      // Mensagem de erro mais específica se disponível
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Erro ao atualizar usuário.';

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Função para lidar com o fechamento do modal
  function handleOpenChange(open: boolean) {
    if (!isSubmitting) {
      onOpenChange(open);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-4 w-4" />
            Editar Usuário
          </DialogTitle>
        </DialogHeader>

        <UsuarioForm
          mode="edit"
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          openChange={onOpenChange}
          secretarias={secretarias}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
