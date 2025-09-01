import { categoriaServicoService } from '@/services/categoriaServicoService';
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
    SetStateAction<(ServicoCategoria & { id: number })[] | null>
  >; // ← ATUALIZADO: Adicionado | null
  onEdit: (categoria: ServicoCategoria & { id: number }) => void;
}

export function CategoriaListItem({
  categoria,
  setCategorias,
  onEdit,
}: CategoriaListItemProps) {
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  async function handleDeleteCategoria() {
    try {
      await categoriaServicoService.toggleAtivo(categoria.id, false);

      setCategorias((prev) => {
        // ← ATUALIZADO: Tratamento para null
        if (!prev) return prev; // Se for null, mantém null

        return prev.map((c) =>
          c.id === categoria.id ? { ...c, ativo: false } : c,
        );
      });

      toast.success('Categoria desativada com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao desativar categoria');
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
          <div className="flex gap-2 items-center">
            {/* ← MELHORADO: flex para alinhamento */}
            <button
              className="text-black-600"
              onClick={() => onEdit(categoria)}
              title="Editar categoria"
            >
              <IconEdit size={18} stroke={2} className="text-black-600" />
            </button>
            <button
              onClick={() => setIsOpenDeleteModal(true)}
              className="text-black-600"
              title="Excluir categoria"
            >
              <IconTrash size={18} stroke={2} className="text-black-600" />
            </button>
            <CategoriaVisibility
              categoria={categoria}
              setCategorias={setCategorias}
            />
          </div>
        </TableCell>
      </TableRow>

      <ConfirmModal
        isOpen={isOpenDeleteModal}
        onConfirm={async () => {
          await handleDeleteCategoria();
          window.location.reload(); // ← CONSIDERE: Remover reload e usar estado
        }}
        onCancel={() => setIsOpenDeleteModal(false)}
        title="Você deseja apagar a categoria?"
        message="Tem certeza de que quer apagar a categoria? Ao confirmar, todos os dados relacionados a ela serão permanentemente excluídos."
      />
    </>
  );
}
