import type { BannerModel } from '@/types/Banner';
import type { Dispatch, SetStateAction } from 'react';

type EditBannerForm = {
  banner: BannerModel;
  setBanners: Dispatch<SetStateAction<BannerModel | null>>;
};

export function EditBannerForm({ banner, setBanners }: EditBannerForm) {
  return <form></form>;
}
