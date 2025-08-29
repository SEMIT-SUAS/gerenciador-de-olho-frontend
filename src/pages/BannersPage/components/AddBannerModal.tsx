import { AddABannerForm } from '@/pages/BannersPage/components/AddBannerForm';
import { DialogHeader } from '@/components/ui/dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';

type AddBannerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  reloadBanners: () => void;
};

export function AddBannerModal({
  isOpen,
  onClose,
  reloadBanners,
}: AddBannerModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={true}>
      <DialogContent>
        <DialogHeader className="text-center!">
          <DialogTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Adicionar Banner
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Preencha os detalhes do banner que deseja criar.
          </DialogDescription>
        </DialogHeader>

        <AddABannerForm
          onSuccess={() => {
            onClose();
            reloadBanners();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
