import type { EspacoPublicoModel } from '@/types/EspacoPublico';
import { useState } from 'react';
import { Loading } from '../../../components/Loading/Loading';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { toast } from 'sonner';
import { espacoPublicoService } from '@/services/espacoPublicoService';
import { ConfirmModal } from '@/components/Modals/ConfirmModal';

interface EspacoPublicoVisibilityProps {
  espacoPublico: EspacoPublicoModel;
  setEspacosPublicos: React.Dispatch<
    React.SetStateAction<EspacoPublicoModel[]>
  >;
}

export function EspacoPublicoVisibility({
  espacoPublico,
  setEspacosPublicos,
}: EspacoPublicoVisibilityProps) {
  const [isChangingVisibility, setIsChangingVisibility] = useState(false);
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);

  async function handleOnClickButton() {
    try {
      setIsChangingVisibility(true);
      await espacoPublicoService.toggleVisibility(
        espacoPublico.id,
        !espacoPublico.visivel,
      );

      setEspacosPublicos(
        (prev) =>
          prev?.map((prevEspacos) =>
            prevEspacos.id === espacoPublico.id
              ? { ...prevEspacos, visivel: !espacoPublico.visivel }
              : prevEspacos,
          ) ?? [],
      );
      setIsOpenConfirm(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsChangingVisibility(false);
    }
  }

  return (
    <>
      <button
        className="text-blue-500 hover:text-blue-700"
        onClick={() => setIsOpenConfirm(true)}
      >
        {isChangingVisibility ? (
          <Loading className="size-[18px]" />
        ) : espacoPublico.visivel ? (
          <IconEye stroke={2} size={18} />
        ) : (
          <IconEyeOff stroke={2} size={18} />
        )}
      </button>

      <ConfirmModal
        isOpen={isOpenConfirm}
        title={`Ocultar ${espacoPublico.nome}?`}
        message={`Tem certeza que deseja ${
          espacoPublico.visivel ? 'ocultar' : 'tornar visível'
        } este espaço público?`}
        onConfirm={handleOnClickButton}
        onCancel={() => setIsOpenConfirm(false)}
      />
    </>
  );
}
