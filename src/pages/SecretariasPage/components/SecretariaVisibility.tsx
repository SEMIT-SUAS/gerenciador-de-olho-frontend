import { useState, type Dispatch, type SetStateAction } from 'react';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { ConfirmModal } from '@/components/Modals/ConfirmModal';
import type { Secretaria } from '@/types/Secretaria';
import { SecretariaService } from '@/services/secretariaService';
import { toast } from 'sonner';

type ServicoVisibilityProps = {
  secretaria: Secretaria;
  setSecretarias: Dispatch<SetStateAction<Secretaria[]>>;
};

export function SecretariaVisibility({
  secretaria,
  setSecretarias,
}: ServicoVisibilityProps) {
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);

  async function handleOnClickButton() {
    try {
      ///sem função ainda
      await new SecretariaService().toggleVisibility(
        secretaria.id,
        !secretaria.visivel,
      );
      setSecretarias(
        (prev) =>
          prev?.map((prevSecretaria) =>
            prevSecretaria.id === secretaria.id
              ? { ...prevSecretaria, visivel: !secretaria.visivel }
              : prevSecretaria,
          ) ?? null,
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
        {secretaria.visivel ? (
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
          secretaria.visivel
            ? 'Você deseja ocultar a secretaria?'
            : 'Você deseja tornar a secretaria visível?'
        }
        message={
          secretaria.visivel
            ? 'A secretaria ficará oculta e não será mais exibida.'
            : 'A secretaria ficará visível novamente.'
        }
      />
    </>
  );
}
