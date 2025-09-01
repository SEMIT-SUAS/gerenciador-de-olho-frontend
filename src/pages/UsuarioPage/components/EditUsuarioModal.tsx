import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Pencil } from 'lucide-react';
import { toast } from 'sonner';

// MUDANÇA: Import do componente separado
import { UsuarioEditForm } from './usuarioForm/usuariaFormEdit';
import type { Secretaria } from '@/types/Secretaria';
import type { UsuarioPorId } from '@/types/Usuario';
import usuarioService from '@/services/usuariosService';
// MUDANÇA: Import do schema separado
import { type UsuarioEditValues } from './usuarioForm/usuarioSchemaEdit';

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
  // MUDANÇA: defaultValues com todos os campos do usuário existente
  const defaultValues: UsuarioEditValues = {
    nome: usuario.nome,
    contato: usuario.contato,
    email: usuario.email,
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

      // MUDANÇA: Enviar apenas os dados editáveis junto com o ID
      await usuarioService.updateUsuario({
        id: usuario.id,
        nome: data.nome,
        contato: data.contato,
      });

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

        {/* MUDANÇA: Usar o componente específico de edição */}
        <UsuarioEditForm
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
