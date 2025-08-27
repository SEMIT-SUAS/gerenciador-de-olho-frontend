import type { CategoriaDenunciaModel } from '@/types/CategoriaDenuncia';
import { useState, type Dispatch, type SetStateAction } from 'react';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { Loader2 } from 'lucide-react';
import { CategoriaDenunciaService } from '@/services/CategoriaDenunciaService';
import { toast } from 'sonner';
import { ConfirmModal } from '@/components/Modals/ConfirmModal';

type CategoryVisibilityProps = {
  category: CategoriaDenunciaModel;
  setCategories: Dispatch<SetStateAction<CategoriaDenunciaModel[] | null>>;
};

export function CategoryVisibility({
  category,
  setCategories,
}: CategoryVisibilityProps) {
  const [isChangingVisibility, setIsChangingVisibility] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const goingToVisible = !category.visivel;
  const title = goingToVisible
    ? 'Tornar categoria visível?'
    : 'Ocultar categoria?';
  const message = goingToVisible
    ? `A categoria “${
        category.nome ?? category.id
      }” ficará visível para os usuários. Deseja continuar?`
    : `A categoria “${
        category.nome ?? category.id
      }” será ocultada dos usuários. Deseja continuar?`;

  async function handleConfirm() {
    try {
      setIsChangingVisibility(true);
      await categoriaService.toggleVisibility(category.id, !category.visivel);
      setCategories(
        (prev) =>
          prev?.map((prevCategory) =>
            prevCategory.id === category.id
              ? { ...prevCategory, visivel: !category.visivel }
              : prevCategory,
          ) ?? null,
      );

      toast.success(
        goingToVisible ? 'Categoria agora está visível' : 'Categoria ocultada',
      );
    } catch (error: any) {
      toast.error(error?.message ?? 'Erro ao alterar visibilidade');
    } finally {
      setIsChangingVisibility(false);
      setIsConfirmOpen(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsConfirmOpen(true)}
        disabled={isChangingVisibility}
        aria-busy={isChangingVisibility}
        title={category.visivel ? 'Ocultar categoria' : 'Tornar visível'}
        className="disabled:opacity-60"
      >
        {isChangingVisibility ? (
          <Loader2 className="size-[18px] animate-spin" />
        ) : category.visivel ? (
          <IconEye stroke={2.3} size={18} />
        ) : (
          <IconEyeOff stroke={2.3} size={18} />
        )}
      </button>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onCancel={() => !isChangingVisibility && setIsConfirmOpen(false)}
        onConfirm={handleConfirm}
        title={title}
        message={message}
        confirmText="Confirmar"
        cancelText="Cancelar"
        variant="default" // sempre azul
        isLoading={isChangingVisibility}
      />
    </>
  );
}
