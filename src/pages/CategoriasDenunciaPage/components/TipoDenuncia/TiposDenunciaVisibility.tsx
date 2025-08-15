import { useState, type Dispatch, type SetStateAction } from 'react';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import tiposDenunciaService from '@/services/tiposDenunciaService';
import type {
  TipoDenunciaListar,
  TipoDenunciaModel,
} from '@/types/TipoDenuncia';
import { ConfirmModal } from '@/components/Modals/ConfirmModal';

type TipoVisibilityProps = {
  tipo: TipoDenunciaModel;
  setTipos: Dispatch<SetStateAction<TipoDenunciaModel[]>>;
};

export function TipoVisibility({ tipo, setTipos }: TipoVisibilityProps) {
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);

  async function handleOnClickButton() {
    try {
      await tiposDenunciaService.changeTipoVisibility(tipo.id, !tipo.visivel);
      setTipos((prev) =>
        prev.map((prevTipo) =>
          prevTipo.id === tipo.id
            ? { ...prevTipo, visivel: !tipo.visivel }
            : prevTipo,
        ),
      );
    } catch (error: any) {
      toast.error(error.message);
    }
    setIsOpenConfirmModal(false);
  }

  return (
    <>
      <button
        className="text-black-500"
        onClick={() => setIsOpenConfirmModal(true)}
      >
        {tipo.visivel ? (
          <IconEye stroke={2} size={18} />
        ) : (
          <IconEyeOff stroke={2} size={18} />
        )}
      </button>
      <ConfirmModal
        isOpen={isOpenConfirmModal}
        onConfirm={handleOnClickButton}
        onCancel={() => setIsOpenConfirmModal(false)}
        title={
          tipo.visivel
            ? 'Você deseja ocultar o tipo?'
            : 'Você deseja tornar o tipo visível?'
        }
        message={
          tipo.visivel
            ? 'Ao confirmar, o tipo ficará oculto para os usuários.'
            : 'Ao confirmar, o tipo ficará visível para os usuários.'
        }
      />
    </>
  );
}
