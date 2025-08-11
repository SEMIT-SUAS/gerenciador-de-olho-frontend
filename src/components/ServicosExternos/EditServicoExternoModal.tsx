import { useState, type Dispatch, type SetStateAction } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { toast } from 'sonner';
import type { Portais } from '@/types/Portais';
import type { ServicoSchema } from './schemaServicoExterno';
import { uploadServicoExterno } from '@/services/servicosExternosService';
import { ServicoExternoForm } from './ServicoExternoForm';
import type { ServicoExterno } from '@/types/ServicoExterno';

interface AddServicoExternoModalProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  setServicos: Dispatch<SetStateAction<ServicoExterno[]>>;
}

export function AddServicoExternoModal({
  open,
  onOpenChange,
  setServicos,
}: AddServicoExternoModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(data: ServicoSchema) {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('nome', data.nome);
      if (data.imagem && data.imagem instanceof File) {
        formData.append('imagem', data.imagem);
      }
      formData.append('visivel', String(data.visivel));
      formData.append('ativo', String(data.ativo));

      await uploadServicoExterno(formData);
      toast.success('Serviço cadastrado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Ocorreu um erro ao criar o portal.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Serviço Externo</DialogTitle>
        </DialogHeader>
        <ServicoExternoForm isSubmitting={isSubmitting} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}
