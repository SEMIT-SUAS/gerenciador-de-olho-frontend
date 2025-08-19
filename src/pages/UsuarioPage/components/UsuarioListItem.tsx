// src/pages/UsuariosPage/components/UsuariosListItem.tsx

import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { UsuarioLogin } from '@/types/Usuario';
import type { Secretaria } from '@/types/Secretaria';
import { toast } from 'sonner';

import { TableCell, TableRow } from '@/components/ui/table';
import { IconEdit, IconTrash, IconUser } from '@tabler/icons-react';

import { ConfirmModal } from '@/components/Modals/ConfirmModal';
// import { EditUsuarioModal } from './EditUsuarioModal';
import { Badge } from '@/components/ui/badge';

interface UsuariosListItemProps {
  usuario: UsuarioLogin;
  secretarias: Secretaria[];
  setUsuarios: Dispatch<SetStateAction<UsuarioLogin[]>>;
}

export function UsuariosListItem({
  usuario,
  secretarias,
  setUsuarios,
}: UsuariosListItemProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Buscar a secretaria pelo ID
  const secretaria = secretarias.find((s) => s.id === usuario.idSecretaria);

  // Implementar quando tiver os métodos no service
  async function handleDelete() {
    try {
      // await usuarioService.excluirUsuario(usuario.id!);
      setUsuarios((prev) => prev.filter((u) => u.id !== usuario.id));
      toast.success('Usuário excluído com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir usuário.');
    }
  }

  return (
    <>
      <TableRow key={usuario.id}>
        <TableCell className="font-medium">{usuario.nome}</TableCell>
        <TableCell>
          <div className="flex flex-col">
            <span className="font-medium">{secretaria?.sigla || 'N/A'}</span>
            <span
              className="text-xs text-gray-500 truncate max-w-[200px]"
              title={secretaria?.nome}
            >
              {secretaria?.nome || 'Secretaria não encontrada'}
            </span>
          </div>
        </TableCell>
        <TableCell>
          <Badge variant="outline" className="gap-2">
            <IconUser size={12} />
            {usuario.perfil}
          </Badge>
        </TableCell>
        <TableCell className="flex items-center gap-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            title="Editar usuário"
            className="hover:text-blue-600 transition-colors"
          >
            <IconEdit size={18} />
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            title="Excluir usuário"
            className="hover:text-red-600 transition-colors"
          >
            <IconTrash size={18} />
          </button>
        </TableCell>
      </TableRow>

      {/* Modal de confirmação para excluir */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir o usuário "${usuario.nome}"? Esta ação não pode ser desfeita.`}
      />

      {/* Modal de edição - descomente quando implementar
      <EditUsuarioModal
        open={isEditModalOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setIsEditModalOpen(false);
          }
        }}
        setUsuarios={setUsuarios}
        usuario={usuario}
      />
      */}
    </>
  );
}
