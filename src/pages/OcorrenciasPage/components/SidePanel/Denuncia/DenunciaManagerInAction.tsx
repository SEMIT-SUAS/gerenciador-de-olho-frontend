import { FaExternalLinkAlt, FaTrashAlt } from 'react-icons/fa';
import type {
  DenunciaBasicInfoModel,
  DenunciaModel,
} from '../../../../../types/Denuncia';
import { useNavigate } from 'react-router-dom';
import { ConfirmModal } from '../../../../../components/Modals/ConfirmModal';
import { useState } from 'react';
// import { useOcorrencias } from '../../../../../context/OcorrenciasContext';
// import denunciasService from '../../../../../services/DenunciaService';
import { getPolygonoCenter } from '@/utils/geometry';
import { DenunciaService } from '@/services/DenunciaService';
import { toast } from 'sonner';
import type { EnderecoModel } from '@/types/Endereco';

type DenunciaManageInActionProps = {
  denuncia: DenunciaBasicInfoModel;
  allowDisvincularItem: boolean;
  onDisvincular: (denunciaId: number) => void; // <-- 1. Adicionar o callback
};

const formatarEndereco = (
  endereco: string | EnderecoModel | undefined,
): string => {
  if (!endereco) {
    return 'Endereço não informado';
  }
  if (typeof endereco === 'string') {
    return endereco;
  }
  if (typeof endereco === 'object' && endereco.rua) {
    return `${endereco.rua}, ${endereco.bairro}`;
  }
  return 'Endereço inválido';
};

export function DenunciaManageInAction({
  denuncia,
  allowDisvincularItem,
  onDisvincular,
}: DenunciaManageInActionProps) {
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);
  const navigate = useNavigate();

  function handleShowDenunciaDetails() {
    navigate(`/ocorrencias/denuncias/${denuncia.id}`);
  }

  async function handleDeleteDenunciaFromAction() {
    try {
      setIsOpenConfirmationModal(false); // Fechar modal
      await DenunciaService.desvincularAcao(denuncia.id);

      onDisvincular(denuncia.id);

      toast.success('Denúncia desvinculada com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao desvincular a denúncia.');
    }
  }

  return (
    <>
      <div
        aria-label={`Ver detalhes da denúncia ${denuncia.nomeTipoDenuncia}`}
        className="group flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-left transition-all  hover:shadow-md focus:outline-none"
      >
        <div className="flex flex-col">
          <p className="text-xs text-gray-500">
            {formatarEndereco(denuncia.endereco)},
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            aria-label="Ver denúncia"
            className="cursor-pointer rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-green-600"
            onClick={handleShowDenunciaDetails}
          >
            <FaExternalLinkAlt />
          </button>

          {allowDisvincularItem && (
            <button
              onClick={() => setIsOpenConfirmationModal(true)}
              aria-label={`Desvincular denúncia ${denuncia.nomeTipoDenuncia}`}
              className="cursor-pointer rounded-full p-2 text-gray-400 transition-colors hover:bg-red-100 hover:text-red-600"
            >
              <FaTrashAlt />
            </button>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={isOpenConfirmationModal}
        title="Remover denúncia"
        message="Você realmente deseja remover essa denúncia dessa ação?"
        onConfirm={handleDeleteDenunciaFromAction}
        onCancel={() => setIsOpenConfirmationModal(false)}
      />
    </>
  );
}
