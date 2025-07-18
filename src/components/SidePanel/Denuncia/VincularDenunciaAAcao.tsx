import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { BackButton } from '../../Buttons/Backbutton';
import { useEffect, useMemo, useState } from 'react';
import { ConfirmModal } from '../../Modals/ConfirmModal';
import { FaMapPin } from 'react-icons/fa';
import { useFilters } from '../../../context/FiltersContext';
import { useMapActions } from '../../../context/MapActions';
import type { Denuncia } from '../../../types/Denuncia';
import { useOcorrenciasContext } from '../../../context/OcorrenciasContext';
import { toast } from 'react-toastify';

export function VincularDenunciaAAcao() {
  const [isVinculandoDenuncia, setIsVinculandoDenuncia] = useState(false);
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

  function resetFiltersAndMapView() {
    setSalvarAcaoOnclick(false);
    restoreCachedFilters();
    setAcaoSelecionada(null);
  }

  useEffect(() => {
    cacheCurrentFilters();

    setSalvarAcaoOnclick(true);
    setIsVisibleDenunciasInMap(false);
    setIsVisibleAcoesInMap(true);
    setFiltroCategoria('todas');
    setFiltroStatusAcao(['aberto', 'em_andamento']);

    return () => resetFiltersAndMapView();
  }, []);

  if ((!denuncia || denuncia.acaoId != null) && !isVinculandoDenuncia) {
    return <Navigate to="/404" replace />;
  }

  function handleVincularDenuncia() {
    if (!acaoSelecionada) return;
    setIsVinculandoDenuncia(true);

    //TODO: CALL API

    const denunciaUpdatedData: Denuncia = {
      ...denuncia!,
      acaoId: acaoSelecionada.id,
      status: 'em_andamento',
    };

    setDenuncias((denuncias) => {
      return denuncias.map((d) =>
        d.id == denuncia?.id ? denunciaUpdatedData : d,
      );
    });

    navigate(`/ocorrencias/acoes/${acaoSelecionada.id}`);
    toast.success('Denúncia vinculada com sucesso!');
  }

  return (
    <>
      <div className="flex gap-4 flex-col h-full p-4">
        <BackButton to={`/ocorrencias/denuncias/${denunciaId}`} />

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">Vinculando denúncia:</p>
          <p className="font-bold text-blue-900">{denuncia.tipo}</p>
          <p className="flex items-center text-xs text-blue-800 mt-1">
            <FaMapPin className="mr-1.5" />
            {`${denuncia.endereco.rua}, ${denuncia.endereco.bairro}`}
          </p>
        </div>

        <div className="flex flex-col gap-1 flex-1 overflow-y-auto pr-2">
          <h3 className="font-bold text-gray-800">
            Selecione uma Ação Existente:
          </h3>

          <div className="flex flex-col gap-2 p-1">
            {acoesFiltradas.map((acao) => (
              <button
                key={acao.id}
                onClick={() => setAcaoSelecionada(acao)}
                className={`w-full text-left p-3 rounded-lg shadow-sm transition-colors cursor-pointer ${
                  acao.id == acaoSelecionada?.id
                    ? 'bg-blue-100 border border-blue-400'
                    : 'bg-white hover:bg-gray-50 border'
                }`}
              >
                <p className="font-semibold text-gray-800">{acao.nome}</p>
                <p className="text-xs font-medium text-gray-500">
                  {acao.secretaria.name}
                </p>
              </button>
            ))}
          </div>
        </div>

        <button
          className="w-full bg-green-600 text-white font-semibold 
                     py-2.5 rounded-lg transition-colors
                     disabled:cursor-not-allowed disabled:opacity-60 text-sm hover:bg-green-700"
          onClick={() => setIsOpenConfirmationModal(true)}
          disabled={!acaoSelecionada}
        >
          Vincular à ação
        </button>
      </div>

      <ConfirmModal
        isOpen={isOpenConfirmationModal}
        title="Vínculo de denúncia à ação"
        message={`Você deseja vincular a denúncia "${denuncia.tipo}" à ação "${acaoSelecionada?.nome}"?`}
        onCancel={() => setIsOpenConfirmationModal(false)}
        onConfirm={handleVincularDenuncia}
      />
    </>
  );
}
