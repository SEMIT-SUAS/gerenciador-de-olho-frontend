import { useState, type Dispatch, type SetStateAction } from 'react';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import { toggleVisivel } from '@/services/servicocategoriaService'; // ← import correto
import type { ServicoCategoria } from '@/types/CategoriaServico';
import { ConfirmModal } from '@/components/Modals/ConfirmModal';

type CategoriaVisibilityProps = {
  categoria: ServicoCategoria & { id: number };
  setCategorias: Dispatch<
    SetStateAction<(ServicoCategoria & { id: number })[]>
  >; // ← mesma tipagem
};

export function CategoriaVisibility({
  categoria,
  setCategorias,
}: CategoriaVisibilityProps) {
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);

  async function handleOnClickButton() {
    try {
      await toggleVisivel(categoria.id, !categoria.visivel);

      setCategorias(
        (prev: (ServicoCategoria & { id: number })[]) =>
          prev?.map((cat) =>
            cat.id === categoria.id
              ? { ...cat, visivel: !categoria.visivel }
              : cat,
          ) ?? [],
      );

      toast.success(
        categoria.visivel
          ? 'Categoria ocultada com sucesso!'
          : 'Categoria tornada visível com sucesso!',
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
