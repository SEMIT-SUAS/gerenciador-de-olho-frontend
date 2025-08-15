import { ConfirmModal } from '@/components/Modals/ConfirmModal';
import { TableCell, TableRow } from '@/components/ui/table';
import tiposDenunciaService from '@/services/tiposDenunciaService';
import type { TipoDenunciaModel } from '@/types/TipoDenuncia';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useState, type Dispatch, type SetStateAction } from 'react';
import { toast } from 'sonner';
import { TipoVisibility } from './TiposDenunciaVisibility';

interface TiposDenunciaListItemProps {
  tipo: TipoDenunciaModel;
  setTipos: Dispatch<SetStateAction<TipoDenunciaModel[]>>;
  onEdit: (tipo: TipoDenunciaModel) => void;
}

export function TiposDenunciaListItem({
  tipo,
  setTipos,
  onEdit,
}: TiposDenunciaListItemProps) {
  const [isOpenDisableModal, setIsOpenDisableModal] = useState(false);

  async function handleDeactivateTipoDenuncia() {
    try {
      await tiposDenunciaService.changeTipoAtivo(tipo.id, !tipo.ativo);

      setTipos((prev) =>
        prev.map((t) => (t.id === tipo.id ? { ...t, ativo: false } : t)),
      );

      toast.success('Tipo de denúncia desativado com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao desativar o tipo de denúncia.');
      console.log(error);
    } finally {
      setIsOpenDisableModal(false);
    }
  }

  return (
    <>
      <TableRow
        key={tipo.id}
        className={!tipo.ativo ? 'text-slate-500 opacity-70' : ''}
      >
        <TableCell className="p-3 w-16">
          <img src={tipo.icone} alt="" className="w-8 h-8 object-contain" />
        </TableCell>
        <TableCell>{tipo.nome}</TableCell>
        <TableCell>{tipo.categoria}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(tipo)}
              className="text-black-600"
              title="Editar"
              disabled
            >
              <IconEdit size={18} stroke={2} className="text-gray-300" />
            </button>

            {tipo.ativo && (
              <button
                onClick={() => setIsOpenDisableModal(true)}
                className="text-black-600"
                title="Desativar"
              >
                <IconTrash size={18} stroke={2} />
              </button>
            )}

            {/* O componente de visibilidade controla a ativação/desativação */}
            <TipoVisibility tipo={tipo} setTipos={setTipos} />
          </div>
        </TableCell>
      </TableRow>

      {/* 2. O texto do modal foi ajustado para refletir a ação real (Desativar) */}
      <ConfirmModal
        isOpen={isOpenDisableModal}
        onConfirm={handleDeactivateTipoDenuncia} // 3. A função não recarrega mais a página
        onCancel={() => setIsOpenDisableModal(false)}
        title="Desativar tipo de denúncia?"
        message={`Tem certeza que deseja desativar "${tipo.nome}"? Ele não aparecerá como opção para novas denúncias.`}
      />
    </>
  );
}
