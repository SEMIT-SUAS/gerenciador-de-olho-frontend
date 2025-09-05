import { useState, type Dispatch, type SetStateAction } from 'react';
import type { BannerModel } from '@/types/Banner';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { Loading } from '@/components/Loading/Loading';
import { toast } from 'sonner';
import { BannerService } from '@/services/bannersService';
import { ConfirmModal } from '@/components/Modals/ConfirmModal';

type BannerVisibilityProps = {
  banner: BannerModel;
  setBanners: Dispatch<SetStateAction<BannerModel[]>>;
};

export function BannerVisibility({
  banner,
  setBanners,
}: BannerVisibilityProps) {
  const [isChangingVisibility, setIsChangingVisibility] = useState(false);
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);

  async function handleOnClickButton() {
    try {
      setIsChangingVisibility(true);
      await new BannerService().toggleVisibility(banner.id, !banner.visivel);

      setBanners(
        (prev) =>
          prev?.map((prevBanner) =>
            prevBanner.id === banner.id
              ? { ...prevBanner, visivel: !banner.visivel }
              : prevBanner,
          ) ?? null,
      );
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsChangingVisibility(false);
    }
  }

  return (
    <>
      <button onClick={() => setIsOpenConfirm(true)} className="text-black-500">
        {isChangingVisibility ? (
          <Loading className="size-[18px]" />
        ) : banner.visivel ? (
          <IconEye stroke={2.3} size={18} />
        ) : (
          <IconEyeOff stroke={2.3} size={18} />
        )}
      </button>

      <ConfirmModal
        isOpen={isOpenConfirm}
        title={`Ocultar ${banner.nome}?`}
        message={`Tem certeza que deseja ${
          banner.visivel ? 'ocultar' : 'tornar visível'
        } este banner?`}
        onConfirm={handleOnClickButton}
        onCancel={() => setIsOpenConfirm(false)}
      />
    </>
  );
}
