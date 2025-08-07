import { useState, type Dispatch, type SetStateAction } from 'react';
import { PortalForm } from './PortaisForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import type { PortaisSchema } from './portaisSchema';
import PortaisService from '@/services/PortaisService';
import { toast } from 'sonner';
import type { Portais } from '@/types/Portais';


interface AddPortalModalProps {
    open: boolean;
    onOpenChange:(isOpen: boolean) => void;
    setPortais: Dispatch<SetStateAction<Portais[]>>
}


export function AddPortalModal({open, onOpenChange, setPortais}: AddPortalModalProps) {

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  async function onSubmit(data: PortaisSchema) {
      try {
        setIsSubmitting(true);
        
        const newPortal = await PortaisService.createPortal(data); 
  
        if (setPortais) {
          setPortais(prev => [...prev, newPortal]);
        }
  
        toast.success(`Portal "${newPortal.nome}" criado com sucesso!`);
        onOpenChange(false);

  
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
          <DialogTitle>Adicionar Novo Portal</DialogTitle>
        </DialogHeader>
        <PortalForm
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}