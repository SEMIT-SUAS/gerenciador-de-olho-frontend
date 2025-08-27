import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { UsuarioModel } from '@/types/Usuario';
import type { Secretaria } from '@/types/Secretaria';
import { TableCell, TableRow } from '@/components/ui/table';
import { IconEdit, IconTrash, IconUser } from '@tabler/icons-react';

import { Badge } from '@/components/ui/badge';
import { secretariaService } from '@/services/secretariaService';

interface UsuariosListItemProps {
  usuario: UsuarioModel;
  setUsuarios: Dispatch<SetStateAction<UsuarioModel[] | null>>;
  onEdit: (usuario: UsuarioModel) => void;
  onDelete?: (usuario: UsuarioModel) => void;
}

export function UsuariosListItem({
  usuario,
  setUsuarios,
  onEdit,
  onDelete,
}: UsuariosListItemProps) {
  const [secretaria, setSecretaria] = useState<Secretaria | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSecretaria = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await secretariaService.getById(usuario.idSecretaria);
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
            <IconUser size={12} /> {usuario.perfil}
          </Badge>
        </TableCell>
        <TableCell className="flex items-center gap-2">
          <button
            onClick={() => onEdit(usuario)}
            title="Editar usuário"
            className="hover:text-blue-600 transition-colors"
          >
            <IconEdit size={18} />
          </button>
          <button
            onClick={() => onDelete?.(usuario)}
            title="Excluir usuário"
            className="hover:text-red-600 transition-colors"
          >
            <IconTrash size={18} />
          </button>
        </TableCell>
      </TableRow>
    </>
  );
}
