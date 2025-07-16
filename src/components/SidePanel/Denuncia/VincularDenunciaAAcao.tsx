import { Navigate, useParams } from 'react-router-dom';
import { BackButton } from '../../Buttons/Backbutton';
import { useOcorrenciasContext } from '../../../context/OcorrenciasContext';
import { useEffect, useMemo, useState } from 'react';
import { ConfirmModal } from '../../Modals/ConfirmModal';
import type { Acao } from '../../../types/Acao';
import { FaMapPin } from 'react-icons/fa';
import { useFilters } from '../../../context/FiltersContext';

export function VincularDenunciaAAcao() {
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);
  const [currentActionSelected, setCurrentActionSelected] =
    useState<null | Acao>(null);
  const { denuncias, acoes } = useOcorrenciasContext();
  const {
    setIsVisibleDenunciasInMap,
    setIsVisibleAcoesInMap,
    setFiltroStatusAcao,
    setFiltroCategoria,
    cacheCurrentFilters,
    restoreCachedFilters,
  } = useFilters();

  const params = useParams();
  const denunciaId = params.denunciaId;

  const denuncia = useMemo(() => {
    return denuncias.find((d) => d.id == Number(denunciaId));
  }, [denuncias]);

  if (!denuncia) {
    return Navigate({
      to: '/404',
      replace: true,
    });
  }

  useEffect(() => {
    cacheCurrentFilters();

    setIsVisibleDenunciasInMap(false);
    setIsVisibleAcoesInMap(true);
    setFiltroCategoria('todas');
    setFiltroStatusAcao(['aberto', 'em_andamento']);

    return () => {
      restoreCachedFilters();
    };
  }, []);

  function handleVincularDenuncia() {}

  return (
    <>
      <div className="flex gap-4 flex-col h-full">
        <BackButton />

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">Vinculando denúncia:</p>
          <p className="font-bold text-blue-900">{denuncia.tipo}</p>
          <p className="flex text-xs text-blue-800 mt-1">
            <span className="mr-1">
              <FaMapPin />
            </span>
            {`${denuncia.endereco.rua}, ${denuncia.endereco.bairro}`}
          </p>
        </div>

        <h3 className="font-semibold text-gray-800 mb-2">
          Selecione uma Ação Existente:
        </h3>

        <div className="flex-1 rounded-lg overflow-y-auto bg-gray-50 space-y-2 p-2">
          {acoes.map((acao) => (
            <button
              key={acao.id}
              onClick={() => setCurrentActionSelected(acao)}
              className="w-full text-left p-3 bg-white rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
            >
              <p className="font-semibold text-gray-700">{acao.nome}</p>
              <p className="text-xs font-semibold text-gray-300">
                {acao.secretaria.name}
              </p>
            </button>
          ))}
        </div>

        <button
          className="w-full bg-bg-blue-600 bg-green-700 text-white font-semibold 
          py-2.5 rounded-lg transition-colors cursor-pointer 
          disabled:cursor-not-allowed disabled:opacity-60 text-sm"
          onClick={() => setIsOpenConfirmationModal(true)}
          disabled={!currentActionSelected}
        >
          Víncular á ação
        </button>
      </div>

      <ConfirmModal
        isOpen={isOpenConfirmationModal}
        title="Vínculo de denúncia à ação"
        message={`Você deseja vincular essa denúncia ${denuncia.tipo} à essa ação ${currentActionSelected?.nome}?`}
        onCancel={() => setIsOpenConfirmationModal(false)}
        onConfirm={handleVincularDenuncia}
      />
    </>
  );
}
