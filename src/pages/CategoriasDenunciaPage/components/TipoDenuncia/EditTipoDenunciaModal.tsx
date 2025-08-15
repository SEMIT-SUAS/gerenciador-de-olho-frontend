import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { TipoDenunciaModel } from '@/types/TipoDenuncia';
import { useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import { TipoDenunciaForm } from './TipoDenunciaForm/TipoDenunciaForm';
import { type TipoDenunciaFormValues } from './TipoDenunciaForm/tipoDenunciaSchema';
import tiposDenunciaService from '@/services/tiposDenunciaService';
import { toast } from 'react-toastify';
import type { Secretaria } from '@/types/Secretaria';
import type { CategoriaDenunciaModel } from '@/types/CategoriaDenuncia';

interface EditTipoDenunciaModalProps {
  secretarias: Secretaria[];
  categorias: CategoriaDenunciaModel[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setTipos: Dispatch<SetStateAction<TipoDenunciaModel[]>>;
  tipoParaEditar: TipoDenunciaModel;
}

export function EditTipoDenunciaModal({
  open,
  onOpenChange,
  setTipos,
  secretarias,
  categorias,
  tipoParaEditar,
}: EditTipoDenunciaModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formDefaultValues = useMemo(() => {
    if (!tipoParaEditar || !categorias) {
      return undefined;
    }

    const secretariaEncontrada = secretarias.find(
      (s) => s.nome === tipoParaEditar.secretaria,
    );

    const categoriaEncontrada = categorias.find(
      (c) => c.nome === tipoParaEditar.categoria,
    );

    console.log('Secretaria Encontrada:', secretariaEncontrada);
    console.log('Categoria Encontrada:', categoriaEncontrada);

    return {
      nome: tipoParaEditar.nome,
      secretariaId: secretariaEncontrada!.id,
      categoriaId: categoriaEncontrada!.id,
      cor: tipoParaEditar.cor,
      icone: tipoParaEditar.icone,
      visivel: tipoParaEditar.visivel,
      ativo: tipoParaEditar.ativo,
    };
  }, [tipoParaEditar, secretarias, categorias]);

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

      console.log(Object.fromEntries(formData.entries()));

      const newTipo = await tiposDenunciaService.updateTipoDenuncia(formData);

      if (setTipos) {
        setTipos((prev) => [...prev, newTipo]);
      }

      toast.success(`Tipo de denúncia "${newTipo.nome}" criado com sucesso!`);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(
        error.message || 'Ocorreu um erro ao criar o tipo de denúncia.',
      );
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
          defaultValues={formDefaultValues}
        />
      </DialogContent>
    </Dialog>
  );
}
