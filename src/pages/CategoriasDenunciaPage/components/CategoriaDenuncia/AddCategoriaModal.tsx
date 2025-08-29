import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import type { CategoriaDenunciaModel } from '@/types/CategoriaDenuncia';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import type { Dispatch, SetStateAction } from 'react';
import { AddCategoriaForm } from './AddCategoriaForm';

interface AddCategoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  setCategorias: Dispatch<SetStateAction<CategoriaDenunciaModel[]>>;
  reloadCategoriestList: () => Promise<void>;
}

export function AddCategoriaModal({
  isOpen,
  onClose,
  setCategorias,
  reloadCategoriestList,
}: AddCategoriaModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={true}>
      <DialogContent>
        <DialogHeader className="text-center!">
          <DialogTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Adicionar categoria
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Preencha os detalhes da categoria que deseja adicionar.
          </DialogDescription>
        </DialogHeader>

        <AddCategoriaForm
          setCategorias={setCategorias}
          onSuccess={() => {
            onClose();
            reloadCategoriestList();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
