import { FaExternalLinkAlt, FaTrashAlt } from 'react-icons/fa';
import type { Denuncia } from '../../../types/Denuncia';
import { useLocation, useNavigate } from 'react-router-dom';
import { ConfirmModal } from '../../Modals/ConfirmModal';
import { useState } from 'react';
import { useOcorrencias } from '../../../context/OcorrenciasContext';

type DenunciaManageInActionProps = {
  denuncia: Denuncia;
  allowDisvincularItem: boolean;
};

export function DenunciaManageInAction({
  denuncia,
  allowDisvincularItem,
}: DenunciaManageInActionProps) {
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);
  const { setDenuncias } = useOcorrencias();
  const navigate = useNavigate();

  function handleShowDenunciaDetails() {
    navigate(`/ocorrencias/denuncias/${denuncia.id}`);
  }

  function handleDeleteDenunciaFromAction() {
    setDenuncias((denuncias) => denuncias.filter((d) => d.id != denuncia.id));
  }

  return (
    <>
      <div
        aria-label={`Ver detalhes da denúncia ${denuncia.tipo}`}
        className="group flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-left shadow-sm transition-all hover:shadow-md focus:outline-none"
      >
        <div className="flex flex-col">
          <p className="font-semibold text-gray-800">{denuncia.tipo}</p>
          <p className="text-sm text-gray-500">{denuncia.endereco.rua}</p>
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
