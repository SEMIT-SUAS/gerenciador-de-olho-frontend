import { servicoService } from '@/services/servicosServices';
import type { ServicosListar } from '@/types/ServicosListar';
import { useState, type Dispatch, type SetStateAction } from 'react';
import { toast } from 'sonner';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { ServicoVisibility } from '@/pages/ServicosPage/components/ServicoVisibility';
import { ConfirmModal } from '@/components/Modals/ConfirmModal';
import { useNavigate } from 'react-router-dom';

interface ServiceListItemProps {
  servico: ServicosListar;
  setServicos: Dispatch<SetStateAction<ServicosListar[]>>;
}

export function ServicesListItem({
  servico,
  setServicos,
}: ServiceListItemProps) {
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  async function handleDeleteServico() {
    try {
      await servicoService.toggleAtivo(servico.id, false);

      setServicos((prev) =>
        prev.map((s) => (s.id === servico.id ? { ...s, ativo: false } : s)),
      );

      toast.success('Serviço desativado com sucesso!');
    } catch (error: any) {
      toast.error(error.message);
    }

    setIsOpenDeleteModal(false);
  }
  const navigate = useNavigate();

  return (
    <>
      <TableRow key={servico.id}>
        <TableCell>{servico.nome}</TableCell>
        <TableCell>{servico.nomeCategoria ?? '-'}</TableCell>
        <TableCell className="flex flex-wrap gap-2">
          {Array.isArray(servico.nomesPersonas) &&
          servico.nomesPersonas.length > 0 ? (
            servico.nomesPersonas.map((personas, id) => (
              <Badge key={id} variant="outline">
                {personas}
              </Badge>
            ))
          ) : (
            <Badge variant="outline">-</Badge>
          )}
        </TableCell>
        <TableCell>
          <div className="gap-6">
            <button
              className="text-black-600 mr-2"
              onClick={() => navigate(`/servicos/editar/${servico.id}`)}
            >
              <IconEdit size={18} stroke={2} className="text-black-600" />
            </button>
            <button
              onClick={() => setIsOpenDeleteModal(true)}
              className="text-black-600 mr-2"
            >
              <IconTrash size={18} stroke={2} className="text-black-600" />
            </button>
            <button className="text-black-600 mr-2">
              <ServicoVisibility servico={servico} setServicos={setServicos} />
            </button>
          </div>
        </TableCell>
      </TableRow>
      <ConfirmModal
        isOpen={isOpenDeleteModal}
        onConfirm={async () => {
          await handleDeleteServico();
          window.location.reload();
        }}
        onCancel={() => setIsOpenDeleteModal(false)}
        title="Você deseja apagar o serviço?"
        message="Tem certeza de que quer apagar o serviço? Ao confirmar, todos os dados relacionados a ele serão permanentemente excluídos."
      />
    </>
  );
}
