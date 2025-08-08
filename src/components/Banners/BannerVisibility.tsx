import { useState, type Dispatch, type SetStateAction } from 'react';
import type { BannerModel } from '@/types/Banner';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { Loading } from '../Loading/Loading';
import { toast } from 'sonner';
import bannersService from '@/services/bannersService';

type BannerVisibilityProps = {
  banner: BannerModel;
  setBanners: Dispatch<SetStateAction<BannerModel[] | null>>;
};

export function BannerVisibility({
  banner,
  setBanners,
}: BannerVisibilityProps) {
  const [isChangingVisibility, setIsChangingVisibility] = useState(false);

  async function handleOnClickButton() {
    try {
      setIsChangingVisibility(true);
      await bannersService.toggleVisibility(banner.id, !banner.visivel);

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
    <button onClick={handleOnClickButton}>
      {isChangingVisibility ? (
        <Loading className="size-[18px]" />
      ) : banner.visivel ? (
        <IconEye stroke={2.3} size={18} />
      ) : (
        <IconEyeOff stroke={2.3} size={18} />
      )}
    </button>
  );
}
