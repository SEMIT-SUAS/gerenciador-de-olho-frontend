import type { EspacoPublicoModel } from '@/types/EspacoPublico';
import { useState } from 'react';
import { Loading } from '../../../components/Loading/Loading';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { toast } from 'sonner';
import { espacoPublicoService } from '@/services/espacoPublicoService';

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
          ) ?? null,
      );
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsChangingVisibility(false);
    }
  }

  return (
    <button
      className="text-blue-500 hover:text-blue-700"
      onClick={handleOnClickButton}
    >
      {isChangingVisibility ? (
        <Loading className="size-[18px]" />
      ) : espacoPublico.visivel ? (
        <IconEye stroke={2} size={18} />
      ) : (
        <IconEyeOff stroke={2} size={18} />
      )}
    </button>
  );
}
