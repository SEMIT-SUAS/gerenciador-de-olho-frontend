import { toggleAtivo } from '@/services/servicocategoriaService';
import type { ServicoCategoria } from '@/types/CategoriaServico';
import { useState, type Dispatch, type SetStateAction } from 'react';
import { toast } from 'sonner';
import { TableCell, TableRow } from '@/components/ui/table';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { CategoriaVisibility } from '@/pages/CategoriaServicoPage/components/CategoriaVisibility';
import { ConfirmModal } from '@/components/Modals/ConfirmModal';

interface CategoriaListItemProps {
  categoria: ServicoCategoria & { id: number };
  setCategorias: Dispatch<
    SetStateAction<(ServicoCategoria & { id: number })[]>
  >;
  onEdit: (categoria: ServicoCategoria & { id: number }) => void; // ← adicionar esta linha
}

export function CategoriaListItem({
  categoria,
  setCategorias,
  onEdit,
}: CategoriaListItemProps) {
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  async function handleDeleteCategoria() {
    try {
      await toggleAtivo(categoria.id, false);

      setCategorias((prev: (ServicoCategoria & { id: number })[]) =>
        prev.map((c) => (c.id === categoria.id ? { ...c, ativo: false } : c)),
      );

      toast.success('Categoria desativada com sucesso!');
    } catch (error: any) {
      console.log(error);
    }

    setIsOpenDeleteModal(false);
  }

  const src =
    typeof categoria.icone === 'string'
      ? categoria.icone
      : categoria.icone instanceof File
      ? URL.createObjectURL(categoria.icone)
      : '';

  return (
    <>
      <TableRow key={categoria.id}>
        <TableCell>
          <img
            src={src}
            alt={categoria.nome}
            className="w-10 h-10 rounded object-cover"
          />
        </TableCell>
        <TableCell>{categoria.nome}</TableCell>
        <TableCell>
          <div className="gap-6">
            <button
              className="text-black-600 mr-2"
              onClick={() => onEdit(categoria)}
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
              <CategoriaVisibility
                categoria={categoria}
                setCategorias={setCategorias}
              />
            </button>
          </div>
        </TableCell>
      </TableRow>
      <ConfirmModal
        isOpen={isOpenDeleteModal}
        onConfirm={async () => {
          await handleDeleteCategoria();
          window.location.reload();
        }}
        onCancel={() => setIsOpenDeleteModal(false)}
        title="Você deseja apagar a categoria?"
        message="Tem certeza de que quer apagar a categoria? Ao confirmar, todos os dados relacionados a ela serão permanentemente excluídos."
      />
    </>
  );
}
