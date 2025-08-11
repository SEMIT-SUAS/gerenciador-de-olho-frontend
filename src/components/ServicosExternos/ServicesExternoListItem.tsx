import { useState, type Dispatch, type SetStateAction } from 'react';
import { toast } from 'sonner';
import { TableCell, TableRow } from '@/components/ui/table';
import { IconEdit, IconEye, IconEyeOff, IconTrash } from '@tabler/icons-react';
import { ConfirmModal } from '@/components/Modals/ConfirmModal';
import type { ServicoExterno } from '@/types/ServicoExterno';

import servicosExternosService from '@/services/servicosExternosService';
import { ServicoExternoForm } from './ServicoExternoForm';

interface ServiceListItemProps {
  servico: ServicoExterno;
  setServicos: Dispatch<SetStateAction<ServicoExterno[]>>;
}

export function ServicesExternoListItem({
  servico,
  setServicos,
}: ServiceListItemProps) {
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenVisibleModal, setIsOpenVisibleModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  async function handleDeleteServico() {
    try {
      await servicosExternosService.changeServiceAtivo(servico.id, false);

      setServicos((prev) =>
        prev.map((s) => (s.id === servico.id ? { ...s, ativo: false } : s)),
      );

      toast.success('Serviço desativado com sucesso!');
    } catch (error: any) {
      console.log(error);
    }

    setIsOpenDeleteModal(false);
  }

  async function handleVisibilityServico() {
    try {
      await servicosExternosService.changeServiceVisibility(
        servico.id,
        !servico.ativo,
      );

      setServicos((prev) =>
        prev.map((s) => (s.id === servico.id ? { ...s, visivel: false } : s)),
      );

      toast.success('Serviço ocultado do aplicativo!');
    } catch (error: any) {
      console.log(error);
    }
  }

  return (
    <>
      <TableRow key={servico.id}>
        <TableCell>
          <img src={servico.imagem} className="h-14 w-auto rounded-md" />
        </TableCell>
        <TableCell>{servico.nome}</TableCell>
        <TableCell>{servico.link}</TableCell>
        <TableCell>
          <div className="gap-6">
            <button
              className="text-black-600 mr-2"
              onClick={() => setIsEditModalOpen(true)}
            >
              <IconEdit size={18} stroke={2} className="text-black-600" />
            </button>

            <button
              onClick={() => setIsOpenDeleteModal(true)}
              className="text-black-600 mr-2"
            >
              <IconTrash size={18} stroke={2} className="text-black-600" />
            </button>
            <button
              className="text-black-600 mr-2"
              onClick={() => setIsOpenVisibleModal(false)}
            >
              {servico.visivel ? (
                <IconEye stroke={2} size={18} />
              ) : (
                <IconEyeOff stroke={2} size={18} />
              )}
            </button>
          </div>
        </TableCell>
      </TableRow>
      {isEditModalOpen && (
        <ServicoExternoForm
          mode="edit"
          defaultValues={servico} //mudar de file para string no FormServicoExterno ou ao contrario
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => {
            setIsEditModalOpen(false);
            // TODO: atualizar a lista se necessário
          }}
        />
      )}

      <ConfirmModal
        isOpen={isOpenDeleteModal}
        onConfirm={handleDeleteServico}
        onCancel={() => setIsOpenDeleteModal(false)}
        title="Você deseja apagar o serviço?"
        message="Tem certeza de que quer apagar o serviço? Ao confirmar, todos os dados relacionados a ele serão permanentemente excluídos."
      />

      <ConfirmModal
        isOpen={isOpenVisibleModal}
        onConfirm={handleVisibilityServico}
        onCancel={() => setIsOpenVisibleModal(false)}
        title="Você deseja alterar a visibilidade do serviço?"
        message="Tem certeza de que quer alterar a visibiliade do serviço? Ao confirmar, o serviço não ficará visível no aplicativo."
      />
    </>
  );
}
