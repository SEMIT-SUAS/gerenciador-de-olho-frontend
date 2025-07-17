import { useEffect, useMemo, useState } from 'react';
import { ConfirmModal } from '../../Modals/ConfirmModal';
import { Navigate, useParams } from 'react-router-dom';
import { useOcorrenciasContext } from '../../../context/OcorrenciasContext';
import { BackButton } from '../../Buttons/Backbutton';
import { useFilters } from '../../../context/FiltersContext';
import { useMapActions } from '../../../context/MapActions';
import { Tag } from '../Tag';

export function VincularDenunciasAAcao() {
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);
  const { denunciasSelecionas, addDenunciaNaSelecao } = useMapActions();
  const { acoes } = useOcorrenciasContext();
  const { denunciasFiltradas } = useFilters();

  const params = useParams();
  const acaoId = params.acaoId;

  const acao = useMemo(() => {
    return acoes.find((a) => a.id == Number(acaoId));
  }, [acoes]);

  if (!acao || !['aberto', 'em_andamento'].includes(acao.status)) {
    return <Navigate to="/404" replace />;
  }

  function handleVincularDenuncias() {}

  useEffect(() => {}, []);

  return (
    <>
      <div className="flex gap-4 flex-col h-full">
        <BackButton to={`/ocorrencias/acoes/${acaoId}`} />

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">Vinculando denúncias á ação:</p>
          <p className="font-bold text-blue-900">{acao.nome}</p>

          <Tag status={acao.status} />
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-gray-800">
            Selecione denuncias existentes:
          </h3>

          <div className="flex flex-col gap-2 p-2 rounded-lg overflow-y-auto">
            {denunciasFiltradas.map((denuncia) => (
              <button
                key={denuncia.id}
                onClick={() => addDenunciaNaSelecao(denuncia)}
                className={`w-full text-left p-3 ${
                  denunciasSelecionas.find((d) => d.id == denuncia.id)
                    ? 'bg-gray-300'
                    : 'bg-white hover:bg-gray-100'
                } rounded-lg shadow-sm transition-colors cursor-pointer`}
              >
                {denuncia.tipo}
              </button>
            ))}
          </div>
        </div>

        <button
          className="w-full bg-bg-blue-600 bg-green-700 text-white font-semibold 
          py-2.5 rounded-lg transition-colors cursor-pointer 
          disabled:cursor-not-allowed disabled:opacity-60 text-sm"
          onClick={() => setIsOpenConfirmationModal(true)}
          disabled={denunciasSelecionas.length < 1}
        >
          Víncular á ação
        </button>
      </div>

      <ConfirmModal
        isOpen={isOpenConfirmationModal}
        title="Vínculo de denúncia à ação"
        message={`Você deseja vincular essa ação as denúncias ${denunciasSelecionas.join(
          ', ',
        )}?`}
        onCancel={() => setIsOpenConfirmationModal(false)}
        onConfirm={handleVincularDenuncias}
      />
    </>
  );
}
