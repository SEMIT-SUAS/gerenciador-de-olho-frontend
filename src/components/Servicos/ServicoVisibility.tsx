import { useState, type Dispatch, type SetStateAction } from 'react';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import servicosServices from '@/services/servicosServices';
import type { Servicos, UpdateServiceModel } from '@/types/Servicos';
import type { ServicosListar } from '@/types/ServicosListar';

type ServicoVisibilityProps = {
  servico: ServicosListar;
  setServicos: Dispatch<SetStateAction<ServicosListar[]>>;
};

export function ServicoVisibility({
  servico,
  setServicos,
}: ServicoVisibilityProps) {
  async function handleOnClickButton() {
    try {
      await servicosServices.changeServiceVisibility(
        servico.id,
        !servico.visivel,
      );
      setServicos(
        (prev) =>
          prev?.map((prevServico) =>
            prevServico.id === servico.id
              ? { ...prevServico, visivel: !servico.visivel }
              : prevServico,
          ) ?? null,
      );
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <button
      className="text-blue-500 hover:text-blue-700"
      onClick={handleOnClickButton}
    >
      {servico.visivel ? (
        <IconEye stroke={2} size={18} />
      ) : (
        <IconEyeOff stroke={2} size={18} />
      )}
    </button>
  );
}
