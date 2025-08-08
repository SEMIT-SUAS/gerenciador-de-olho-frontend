import type { CategoriaDenunciaModel } from '@/types/CategoriaDenuncia';
import { useState, type Dispatch, type SetStateAction } from 'react';
import { Loading } from '../Loading/Loading';
import { IconEye, IconEyeOff } from '@tabler/icons-react';

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
    // try {
    //   setIsChangingVisibility(true);
    //   await categoriaService.toggleVisibility(banner.id, !banner.visivel);
    //   setBanners(
    //     (prev) =>
    //       prev?.map((prevBanner) =>
    //         prevBanner.id === banner.id
    //           ? { ...prevBanner, visivel: !banner.visivel }
    //           : prevBanner,
    //       ) ?? null,
    //   );
    // } catch (error: any) {
    //   toast.error(error.message);
    // } finally {
    //   setIsChangingVisibility(false);
    // }
  }

  return (
    <button onClick={handleOnClickButton}>
      {isChangingVisibility ? (
        <Loading className="size-[18px]" />
      ) : category.visivel ? (
        <IconEye stroke={2.3} size={18} />
      ) : (
        <IconEyeOff stroke={2.3} size={18} />
      )}
    </button>
  );
}
