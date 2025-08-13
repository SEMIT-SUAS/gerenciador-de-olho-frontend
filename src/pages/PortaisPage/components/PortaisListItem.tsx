import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { Portais } from '@/types/Portais';
import { toast } from 'sonner';

import { TableCell, TableRow } from '@/components/ui/table';
import {
  IconEdit,
  IconEye,
  IconEyeOff,
  IconStarFilled,
  IconTrash,
} from '@tabler/icons-react';

import {
  toggleAtivo,
  changeServiceVisibility,
} from '@/services/PortaisService';

import { ConfirmModal } from '@/components/Modals/ConfirmModal';
import { EditPortalModal } from './EditPortalModal';
import { Badge } from '@/components/ui/badge';

interface PortaisListItemProps {
  portal: Portais;
  setPortais: Dispatch<SetStateAction<Portais[]>>;
}

export function PortaisListItem({ portal, setPortais }: PortaisListItemProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);

  async function handleToggleAtivo() {
    try {
      await toggleAtivo(portal.id!, !portal.ativo);
      setPortais((prev) =>
        prev.map((p) =>
          p.id === portal.id ? { ...p, ativo: !portal.ativo } : p,
        ),
      );
      toast.success(
        `Portal ${portal.ativo ? 'inativado' : 'ativado'} com sucesso!`,
      );
    } catch (error) {
      toast.error('Erro ao atualizar status de atividade.');
    }
  }

  async function handleToggleVisibilidade() {
    try {
      await changeServiceVisibility(portal.id!, !portal.visivel);
      setPortais((prev) =>
        prev.map((p) =>
          p.id === portal.id ? { ...p, visivel: !portal.visivel } : p,
        ),
      );
      toast.success(`Visibilidade do portal alterada com sucesso!`);
    } catch (error) {
      toast.error('Erro ao atualizar visibilidade.');
    }
  }

  return (
    <>
      <TableRow key={portal.id}>
        <TableCell className="font-medium">{portal.nome}</TableCell>
        <TableCell className="truncate">
          <a
            href={portal.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black underline text-sm"
          >
            {portal.link.length > 30
              ? `${portal.link.substring(0, 30)}...`
              : portal.link}
          </a>
        </TableCell>

        <TableCell>
          {portal.destaque && (
            <Badge variant="outline" className="gap-2">
              <IconStarFilled className="text-yellow-300" size={'12px'} />
              Destacado
            </Badge>
          )}
        </TableCell>

        <TableCell className="flex items-center gap-2">
          <button onClick={() => setIsOpenModalEdit(true)} title="Editar">
            <IconEdit size={18} />
          </button>
          <button
            onClick={() => setIsOpenConfirmModal(true)}
            title={portal.visivel ? 'Ocultar' : 'Mostrar'}
          >
            {portal.visivel ? <IconEye size={18} /> : <IconEyeOff size={18} />}
          </button>
          <button onClick={() => setIsDeleteModalOpen(true)} title="Excluir">
            <IconTrash size={18} />
          </button>
        </TableCell>
      </TableRow>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onConfirm={handleToggleAtivo}
        onCancel={() => setIsDeleteModalOpen(false)}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir o portal "${portal.nome}"?`}
      />

      <EditPortalModal
        open={isOpenModalEdit}
        onOpenChange={(isOpenModalEdit) => {
          if (!isOpenModalEdit) {
            setIsOpenModalEdit(false);
          }
        }}
        setPortais={setPortais}
        portal={portal}
      />
      <ConfirmModal
        isOpen={isOpenConfirmModal}
        onConfirm={handleToggleVisibilidade}
        onCancel={() => setIsOpenConfirmModal(false)}
        title={
          portal.visivel
            ? 'Você deseja ocultar o portal?'
            : 'Você deseja tornar o portal visível?'
        }
        message={
          portal.visivel
            ? 'Ao confirmar, o portal ficará oculto para os usuários.'
            : 'Ao confirmar, o portal ficará visível para os usuários.'
        }
      />
    </>
  );
}
