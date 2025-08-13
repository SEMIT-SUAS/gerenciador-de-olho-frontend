import { EditBannerForm } from '@/pages/BannersPage/components/EditBannerForm';
import { DialogHeader } from '@/components/ui/dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import type { BannerModel } from '@/types/Banner';
import type { Dispatch, SetStateAction } from 'react';

type EditBannerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  bannerToEdit: BannerModel;
  setBanners: Dispatch<SetStateAction<BannerModel[] | null>>;
};

export function EditBannerModal({
  isOpen,
  onClose,
  setBanners,
  bannerToEdit,
}: EditBannerModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={true}>
      <DialogContent>
        <DialogHeader className="text-center!">
          <DialogTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Editar Banner
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Preencha as informações que você quer alterar do banner.
          </DialogDescription>
        </DialogHeader>

        <EditBannerForm
          banner={bannerToEdit}
          setBanners={setBanners}
          onSuccess={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
