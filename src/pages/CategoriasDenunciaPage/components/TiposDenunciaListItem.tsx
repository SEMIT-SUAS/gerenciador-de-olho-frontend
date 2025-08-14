import { ConfirmModal } from '@/components/Modals/ConfirmModal';
import { TableCell, TableRow } from '@/components/ui/table';
import { ServicoVisibility } from '@/pages/ServicosPage/components/ServicoVisibility';
import tiposDenunciaService from '@/services/tiposDenunciaService';
import type { TipoDenunciaModel } from '@/types/TipoDenuncia';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useState, type Dispatch, type SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { TipoVisibility } from './TiposDenunciaVisibility';

interface TiposDenunciaListItemProps {
  tipo: TipoDenunciaModel;
  setTipos: Dispatch<SetStateAction<TipoDenunciaModel[]>>;
}

export function TiposDenunciaListItem({
  tipo,
  setTipos,
}: TiposDenunciaListItemProps) {
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  async function handleDeleteTipoDenuncia() {
    try {
      await tiposDenunciaService.changeTipoAtivo(tipo.id, !tipo.ativo);

      setTipos((prev) =>
        prev.map((t) => (t.id === tipo.id ? { ...t, ativo: false } : t)),
      );

      toast.success('Serviço desativado com sucesso!');
    } catch (error: any) {
      console.log(error);
    }

    setIsOpenDeleteModal(false);
  }

  const navigate = useNavigate();

  return (
    <>
      <TableRow key={tipo.id}>
        <TableCell className="p-3 w-16">
          <img src={tipo.icone} alt="" className="w-8 h-8 object-contain" />
        </TableCell>
        <TableCell>{tipo.nome}</TableCell>
        <TableCell>{tipo.categoria}</TableCell>
        <TableCell>
          <div className="gap-6">
            <button className="text-black-600 mr-2">
              <IconEdit size={18} stroke={2} className="text-black-600" />
            </button>
            <button
              onClick={() => setIsOpenDeleteModal(true)}
              className="text-black-600 mr-2"
            >
              <IconTrash size={18} stroke={2} className="text-black-600" />
            </button>
            <button className="text-black-600 mr-2">
              <TipoVisibility tipo={tipo} setTipos={setTipos} />
            </button>
          </div>
        </TableCell>
      </TableRow>
      <ConfirmModal
        isOpen={isOpenDeleteModal}
        onConfirm={async () => {
          await handleDeleteTipoDenuncia();
          window.location.reload();
        }}
        onCancel={() => setIsOpenDeleteModal(false)}
        title="Você deseja apagar o tipo?"
        message="Tem certeza de que quer apagar o tipo? Ao confirmar, todos os dados relacionados a ele serão permanentemente excluídos."
      />
    </>
  );
}
