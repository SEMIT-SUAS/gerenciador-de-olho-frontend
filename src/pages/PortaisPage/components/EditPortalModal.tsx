import { PortalForm } from './PortaisForm/PortaisForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Portais } from '@/types/Portais';
import { useState, type Dispatch, type SetStateAction } from 'react';
import type { PortaisSchema } from './PortaisForm/portaisSchema';
import { portalService } from '@/services/PortaisService';
import { toast } from 'sonner';

interface EditPortalModalProps {
  portal?: Portais;
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  setPortais: Dispatch<SetStateAction<Portais[]>>;
}

export function EditPortalModal({
  portal,
  open,
  onOpenChange,
  setPortais,
}: EditPortalModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(data: PortaisSchema) {
    try {
      setIsSubmitting(true);

      const payload = {
        ...data,
        id: Number(portal!.id),
      };

      const newPortal = await portalService.update(payload);

      if (setPortais) {
        setPortais((prev) => (prev ? [...prev, newPortal] : [newPortal]));
      }

      toast.success(`Portal "${newPortal.nome}" criado com sucesso!`);

      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Ocorreu um erro ao criar o portal.');
    } finally {
      setIsSubmitting(false);
    }

    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Portal</DialogTitle>
        </DialogHeader>
        <PortalForm
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
          defaultValues={portal}
        />
      </DialogContent>
    </Dialog>
  );
}
