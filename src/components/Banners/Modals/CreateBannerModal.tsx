import { CreateBannerForm } from '@/components/Forms/CreateBannerForm';

type CreateBannerModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CreateBannerModal({ isOpen, onClose }: CreateBannerModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
      <div>
        <h1>Adicionar Banner</h1>
      </div>

      <CreateBannerForm />
    </div>
  );
}
