import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { CategoriaDenunciaModel } from '@/types/CategoriaDenuncia';
import type { Dispatch, SetStateAction } from 'react';
import { EditCategoriaForm } from './EditCategoriaForm';

interface EditCategoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoriaDenunciaModel;
  setCategorias: Dispatch<SetStateAction<CategoriaDenunciaModel[]>>;
}

export function EditCategoriaModal({
  isOpen,
  onClose,
  category,
  setCategorias,
}: EditCategoriaModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={true}>
      <DialogContent>
        <DialogHeader className="text-center!">
          <DialogTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Editar categoria
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Preencha os detalhes da categoria que deseja editar.
          </DialogDescription>
        </DialogHeader>

        <EditCategoriaForm
          setCategorias={setCategorias}
          category={category}
          onSuccess={() => onClose()}
        />
      </DialogContent>
    </Dialog>
  );
}
