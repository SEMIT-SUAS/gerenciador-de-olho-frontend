import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { BackButton } from '../../Buttons/Backbutton';
import { useEffect, useMemo, useState } from 'react';
import { ConfirmModal } from '../../Modals/ConfirmModal';
import { FaMapPin } from 'react-icons/fa';
import { useFilters } from '../../../context/FiltersContext';
import { useMapActions } from '../../../context/MapActions';
import type { Denuncia } from '../../../types/Denuncia';
import { useOcorrenciasContext } from '../../../context/OcorrenciasContext';

export function VincularDenunciaAAcao() {
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);
  const { setDenuncias, denuncias } = useOcorrenciasContext();
  const {
    setIsVisibleDenunciasInMap,
    setIsVisibleAcoesInMap,
    setFiltroStatusAcao,
    setFiltroCategoria,
    cacheCurrentFilters,
    restoreCachedFilters,
    acoesFiltradas,
  } = useFilters();
  const { setSalvarAcaoOnclick, acaoSelecionada, setAcaoSelecionada } =
    useMapActions();

  const params = useParams();
  const denunciaId = params.denunciaId;
  const navigate = useNavigate();

  const denuncia = useMemo(() => {
    return denuncias.find((d) => d.id == Number(denunciaId));
  }, [denuncias, denunciaId]);

  if (!denuncia || denuncia.acaoId != null) {
    return <Navigate to="404" replace />;
  }

  useEffect(() => {
    cacheCurrentFilters();

    setSalvarAcaoOnclick(true);
    setIsVisibleDenunciasInMap(false);
    setIsVisibleAcoesInMap(true);
    setFiltroCategoria('todas');
    setFiltroStatusAcao(['aberto', 'em_andamento']);

    return () => {
      setSalvarAcaoOnclick(false);
      restoreCachedFilters();
      setAcaoSelecionada(null);
    };
  }, []);

  function handleVincularDenuncia() {
    const denunciaUpdatedData: Denuncia = {
      ...denuncia!,
      acaoId: acaoSelecionada?.id,
    };

    //TODO: CALL API
    setDenuncias((denuncias) =>
      denuncias.map((d) => (d.id == denuncia?.id ? denunciaUpdatedData : d)),
    );
    navigate(`/ocorrencias/acoes/${acaoSelecionada?.id}`);
  }

  return (
    <>
      <div className="flex gap-4 flex-col h-full">
        <BackButton to={`/ocorrencias/denuncias/${denunciaId}`} />

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

        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-gray-800">
            Selecione uma Ação Existente:
          </h3>

          <div className="flex flex-col gap-2 p-2 rounded-lg overflow-y-auto">
            {acoesFiltradas.map((acao) => (
              <button
                key={acao.id}
                onClick={() => setAcaoSelecionada(acao)}
                className={`w-full text-left p-3 ${
                  acao.id == acaoSelecionada?.id
                    ? 'bg-gray-300'
                    : 'bg-white hover:bg-gray-100'
                } rounded-lg shadow-sm transition-colors cursor-pointer`}
              >
                <p className="font-semibold text-gray-700">{acao.nome}</p>
                <p className="text-xs font-semibold text-gray-300">
                  {acao.secretaria.name}
                </p>
              </button>
            ))}
          </div>
        </div>

        <button
          className="w-full bg-bg-blue-600 bg-green-700 text-white font-semibold 
          py-2.5 rounded-lg transition-colors cursor-pointer 
          disabled:cursor-not-allowed disabled:opacity-60 text-sm"
          onClick={() => setIsOpenConfirmationModal(true)}
          disabled={!acaoSelecionada}
        >
          Víncular á ação
        </button>
      </div>

      <ConfirmModal
        isOpen={isOpenConfirmationModal}
        title="Vínculo de denúncia à ação"
        message={`Você deseja vincular essa denúncia ${denuncia.tipo} à essa ação ${acaoSelecionada?.nome}?`}
        onCancel={() => setIsOpenConfirmationModal(false)}
        onConfirm={handleVincularDenuncia}
      />
    </>
  );
}
