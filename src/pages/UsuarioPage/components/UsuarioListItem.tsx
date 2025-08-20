// src/pages/UsuariosPage/components/UsuariosListItem.tsx

import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { UsuarioModel } from '@/types/Usuario';
import type { Secretaria } from '@/types/Secretaria';
import { toast } from 'sonner';

import { TableCell, TableRow } from '@/components/ui/table';
import { IconEdit, IconTrash, IconUser } from '@tabler/icons-react';

import { ConfirmModal } from '@/components/Modals/ConfirmModal';
import { Badge } from '@/components/ui/badge';
import secretariaService from '@/services/secretariaService';

interface UsuariosListItemProps {
  usuario: UsuarioModel;
  setUsuarios: Dispatch<SetStateAction<UsuarioModel[]>>;
  onEdit: (usuario: UsuarioModel) => void; // A nova prop para a função de edição
}

export function UsuariosListItem({
  usuario,
  setUsuarios,
  onEdit, // Recebendo a nova prop
}: UsuariosListItemProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [secretaria, setSecretaria] = useState<Secretaria | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSecretaria = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await secretariaService.getSecretariaById(
          usuario.idSecretaria,
        );
        setSecretaria(data);
      } catch (err) {
        setError('Falha ao carregar a secretaria.');
      } finally {
        setLoading(false);
      }
    };

    if (usuario.idSecretaria) {
      fetchSecretaria();
    } else {
      setLoading(false);
    }
  }, [usuario.idSecretaria]);

  async function handleDelete() {
    try {
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
            onClick={() => onEdit(usuario)} // Chama a função de edição do pai, passando o usuário
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

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir o usuário "${usuario.nome}"? Esta ação não pode ser desfeita.`}
      />
    </>
  );
}