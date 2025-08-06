import servicosServices from '@/services/servicosServices';
import type { ServicosListar } from '@/types/ServicosListar';
import { useState, type Dispatch, type SetStateAction } from 'react';
import { toast } from 'sonner';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { ServicoVisibility } from '@/components/Forms/ServicoForm/ServicoVisibility';
import { ConfirmModal } from '@/components/Modals/ConfirmModal';

interface ServiceListItemProps {
  servico: ServicosListar;
  setServicos: Dispatch<SetStateAction<ServicosListar[]>>;
}

export function ServicesListItem({
  servico,
  setServicos,
}: ServiceListItemProps) {
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  const navigate = useNavigate();

  async function handleDeleteServico() {
    try {
      await servicosServices.changeServiceAtivo(servico.id, false);

      setServicos((prev) =>
        prev.map((s) =>
          s.id === servico.id
            ? { ...s, ativo: false } // Garante que 'ativo' seja false
            : s,
        ),
      );

      toast.success('Serviço desativado com sucesso!');
    } catch (error: any) {
      console.log(error);
    }

    setIsOpenDeleteModal(false);
  }

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
          <button
            className="text-black-600"
            onClick={() => navigate(`/servicos/editar/${servico.id}`)}
          >
            <IconEdit size={18} stroke={2} className="text-black-600" />
          </button>
        </TableCell>
        <TableCell>
          <button
            onClick={() => setIsOpenDeleteModal(true)}
            className="text-black-600"
          >
            <IconTrash size={18} stroke={2} className="text-black-600" />
          </button>
        </TableCell>
        <TableCell>
          <button className="text-black-600">
            <ServicoVisibility servico={servico} setServicos={setServicos} />
          </button>
        </TableCell>
      </TableRow>
      <ConfirmModal
        isOpen={isOpenDeleteModal}
        onConfirm={handleDeleteServico}
        onCancel={() => setIsOpenDeleteModal(false)}
        title="Você deseja apagar o serviço?"
        message="Tem certeza de que quer apagar o serviço? Ao confirmar, todos os dados relacionados a ele serão permanentemente excluídos."
      />
    </>
  );
}
