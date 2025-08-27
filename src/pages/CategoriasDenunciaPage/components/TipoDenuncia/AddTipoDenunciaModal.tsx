import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { TipoDenunciaModel } from '@/types/TipoDenuncia';
import { useState, type Dispatch, type SetStateAction } from 'react';
import { TipoDenunciaForm } from './TipoDenunciaForm/TipoDenunciaForm';
import {
  type TipoDenunciaFormSchema,
  type TipoDenunciaFormValues,
} from './TipoDenunciaForm/tipoDenunciaSchema';
import { tipoDenunciaService } from '@/services/tiposDenunciaService';
import { toast } from 'react-toastify';
import type { Secretaria } from '@/types/Secretaria';
import type { CategoriaDenunciaModel } from '@/types/CategoriaDenuncia';

interface AddTipoDenunciaModalProps {
  secretarias: Secretaria[];
  categorias: CategoriaDenunciaModel[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setTipos: Dispatch<SetStateAction<TipoDenunciaModel[]>>;
}

export function AddTipoDenunciaModal({
  open,
  onOpenChange,
  setTipos,
  secretarias,
  categorias,
}: AddTipoDenunciaModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(data: TipoDenunciaFormValues) {
    try {
      setIsSubmitting(true);

      const formData = new FormData();

      formData.append('nome', data.nome);

      formData.append('secretaria_id', String(data.secretariaId));
      formData.append('categoria_denuncia_id', String(data.categoriaId));
      formData.append('cor', data.cor);
      formData.append('icone', data.icone);
      formData.append('visivel', String(data.visivel));
      formData.append('ativo', String(data.ativo));

      const newTipo = await tipoDenunciaService.create(formData);

      if (setTipos) {
        setTipos((prev) => [...prev, newTipo]);
      }

      toast.success(`Portal "${newTipo.nome}" criado com sucesso!`);
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
          <DialogTitle>Adicionar Novo Tipo de Denúncia</DialogTitle>
        </DialogHeader>
        <TipoDenunciaForm
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
          secretarias={secretarias}
          categorias={categorias}
        />
      </DialogContent>
    </Dialog>
  );
}
