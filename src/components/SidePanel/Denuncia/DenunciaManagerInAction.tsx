import { FaExternalLinkAlt, FaTrashAlt } from 'react-icons/fa';
import type { DenunciaModel } from '../../../types/Denuncia';
import { useNavigate } from 'react-router-dom';
import { ConfirmModal } from '../../Modals/ConfirmModal';
import { useState } from 'react';
import { useOcorrencias } from '../../../context/OcorrenciasContext';
import denunciasService from '../../../services/denunciasService';
import { getPolygonoCenter } from '@/utils/geometry';

type DenunciaManageInActionProps = {
  denuncia: DenunciaModel;
  allowDisvincularItem: boolean;
};

export function DenunciaManageInAction({
  denuncia,
  allowDisvincularItem,
}: DenunciaManageInActionProps) {
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);
  const { setDenuncias, setAcoes } = useOcorrencias();
  const navigate = useNavigate();

  function handleShowDenunciaDetails() {
    navigate(`/ocorrencias/denuncias/${denuncia.id}`);
  }

  async function handleDeleteDenunciaFromAction() {
    try {
      const updatedDenunciaData =
        await denunciasService.desvincularDenunciaAcao(denuncia.id);

      setDenuncias((prevDenuncias) => {
        const newDenuncias = prevDenuncias.map((d) =>
          d.id === denuncia.id ? updatedDenunciaData : d,
        );

        const updatedDenunciasVinculadas = newDenuncias.filter(
          (d) => d.acao?.id === denuncia.acao?.id,
        );

        const actionCenter = getPolygonoCenter(
          updatedDenunciasVinculadas.map((d) => [d.latitude, d.longitude]),
        );

        setAcoes((prevAcoes) =>
          prevAcoes.map((a) =>
            a.id === denuncia.acao?.id
              ? { ...a, latitude: actionCenter[0], longitude: actionCenter[1] }
              : a,
          ),
        );

        return newDenuncias;
      });
    } catch (error) {
      console.error('Erro ao desvincular denúncia:', error);
    }
  }

  return (
    <>
      <div
        aria-label={`Ver detalhes da denúncia ${denuncia.tipo.nome}`}
        className="group flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-left shadow-sm transition-all hover:shadow-md focus:outline-none"
      >
        <div className="flex flex-col">
          <p className="font-semibold text-gray-800">{denuncia.tipo.nome}</p>
          <p className="text-sm text-gray-500">{denuncia.rua}</p>
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
              aria-label={`Desvincular denúncia ${denuncia.tipo}`}
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
