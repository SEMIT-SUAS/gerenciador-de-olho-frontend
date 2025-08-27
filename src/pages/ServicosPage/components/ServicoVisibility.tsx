import { useState, type Dispatch, type SetStateAction } from 'react';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import { servicoService } from '@/services/servicosServices';
import type { ServicosListar } from '@/types/ServicosListar';
import { ConfirmModal } from '@/components/Modals/ConfirmModal';

type ServicoVisibilityProps = {
  servico: ServicosListar;
  setServicos: Dispatch<SetStateAction<ServicosListar[] | null>>;
};

export function ServicoVisibility({
  servico,
  setServicos,
}: ServicoVisibilityProps) {
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);

  async function handleOnClickButton() {
    try {
      await servicoService.toggleVisibility(servico.id, !servico.visivel);

      setServicos((prev) => {
        if (!prev) return prev;

        return prev.map((prevServico) =>
          prevServico.id === servico.id
            ? { ...prevServico, visivel: !servico.visivel }
            : prevServico,
        );
      });

      toast.success(
        !servico.visivel
          ? 'Serviço tornado visível com sucesso!'
          : 'Serviço ocultado com sucesso!',
      );
    } catch (error: any) {
      toast.error(error.message ?? 'Erro ao alterar visibilidade do serviço');
    }

    setIsOpenConfirmModal(false);
  }

  return (
    <>
      <button
        className="text-black-500"
        onClick={() => setIsOpenConfirmModal(true)}
      >
        {servico.visivel ? (
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
          servico.visivel
            ? 'Você deseja ocultar o serviço?'
            : 'Você deseja tornar o serviço visível?'
        }
        message={
          servico.visivel
            ? 'Ao confirmar, o serviço ficará oculto para os usuários.'
            : 'Ao confirmar, o serviço ficará visível para os usuários.'
        }
      />
    </>
  );
}
