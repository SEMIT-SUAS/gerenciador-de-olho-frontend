import { useState, type Dispatch, type SetStateAction } from 'react';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { toast } from 'sonner';
import { toggleVisivel } from '@/services/servicocategoriaService';
import type { ServicoCategoria } from '@/types/CategoriaServico';
import { ConfirmModal } from '@/components/Modals/ConfirmModal';

type CategoriaVisibilityProps = {
  categoria: ServicoCategoria & { id: number };
  setCategorias: Dispatch<
    SetStateAction<(ServicoCategoria & { id: number })[] | null>
  >; // ← ATUALIZADO: Adicionado | null
};

export function CategoriaVisibility({
  categoria,
  setCategorias,
}: CategoriaVisibilityProps) {
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);

  async function handleOnClickButton() {
    try {
      const novoValorVisivel = !categoria.visivel;

      await toggleVisivel(categoria.id, novoValorVisivel);

      setCategorias((prev) => {
        // ← ATUALIZADO: Tratamento para null
        if (!prev) return prev; // Se for null, mantém null

        return prev.map((cat) =>
          cat.id === categoria.id ? { ...cat, visivel: novoValorVisivel } : cat,
        );
      });

      toast.success(
        novoValorVisivel
          ? 'Categoria tornada visível com sucesso!'
          : 'Categoria ocultada com sucesso!',
      );
    } catch (error: any) {
      toast.error(error.message ?? 'Erro ao alterar visibilidade da categoria');
    }

    setIsOpenConfirmModal(false);
  }

  return (
    <>
      <button
        className="text-black-500"
        onClick={() => setIsOpenConfirmModal(true)}
        title={
          categoria.visivel ? 'Ocultar categoria' : 'Tornar categoria visível'
        }
      >
        {categoria.visivel ? (
          <IconEye stroke={2} size={18} />
        ) : (
          <IconEyeOff stroke={2} size={18} />
        )}
      </button>

      <ConfirmModal
        isOpen={isOpenConfirmModal}
        onConfirm={handleOnClickButton}
        onCancel={() => setIsOpenConfirmModal(false)}
        title={
          categoria.visivel
            ? 'Você deseja ocultar esta categoria?'
            : 'Você deseja tornar esta categoria visível?'
        }
        message={
          categoria.visivel
            ? 'Ao confirmar, a categoria ficará oculta para os usuários.'
            : 'Ao confirmar, a categoria ficará visível para os usuários.'
        }
      />
    </>
  );
}
