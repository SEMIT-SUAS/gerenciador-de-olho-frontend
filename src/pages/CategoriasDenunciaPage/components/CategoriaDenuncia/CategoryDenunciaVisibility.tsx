import type { CategoriaDenunciaModel } from '@/types/CategoriaDenuncia';
import { useState, type Dispatch, type SetStateAction } from 'react';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { Loader2 } from 'lucide-react';
import { CategoriaDenunciaService } from '@/services/CategoriaDenunciaService';
import { toast } from 'sonner';

type CategoryVisibilityProps = {
  category: CategoriaDenunciaModel;
  setCategories: Dispatch<SetStateAction<CategoriaDenunciaModel[] | null>>;
};

export function CategoryVisibility({
  category,
  setCategories,
}: CategoryVisibilityProps) {
  const [isChangingVisibility, setIsChangingVisibility] = useState(false);

  async function handleOnClickButton() {
    try {
      setIsChangingVisibility(true);
      await new CategoriaDenunciaService().toggleVisibility(
        category.id,
        !category.visivel,
      );
      setCategories(
        (prev) =>
          prev?.map((prevCategory) =>
            prevCategory.id === category.id
              ? { ...prevCategory, visivel: !category.visivel }
              : prevCategory,
          ) ?? null,
      );
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsChangingVisibility(false);
    }
  }

  return (
    <button onClick={handleOnClickButton}>
      {isChangingVisibility ? (
        <Loader2 className="size-[18px]" />
      ) : category.visivel ? (
        <IconEye stroke={2.3} size={18} />
      ) : (
        <IconEyeOff stroke={2.3} size={18} />
      )}
    </button>
  );
}
