import { useEffect, useMemo, useState } from 'react';
import { ConfirmModal } from '../../Modals/ConfirmModal';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useOcorrencias } from '../../../context/OcorrenciasContext';
import { BackButton } from '../../Buttons/Backbutton';
import { useFilters } from '../../../context/FiltersContext';
import { useMapActions } from '../../../context/MapActions';
import { Tag } from '../Tag';
import { getPolygonoCenter } from '../../../utils/geometry';
import type { AcaoStatusModelTypes } from '../../../types/AcaoStatus';
import type { AcaoModel } from '../../../types/Acao';

export function VincularAcaoADenuncias() {
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);
  const {
    denunciasSelecionas,
    addDenunciaNaSelecao,
    setSalvarDenunciasOnClick,
    setDenunciasJaVinculadas,
  } = useMapActions();
  const { acoes, denuncias, setDenuncias, setAcoes } = useOcorrencias();
  const {
    denunciasFiltradas,
    setFiltroDenunciasComAcao,
    setFiltroStatusDenuncia,
    cacheCurrentFilters,
    restoreCachedFilters,
    setIsVisibleAcoesInMap,
  } = useFilters();

  const params = useParams();
  const navigate = useNavigate();
  const acaoId = params.acaoId;

  const acao = useMemo(() => {
    return acoes.find((a) => a.id == Number(acaoId));
  }, [acoes]);

  const currentAcaoStatus = useMemo((): AcaoStatusModelTypes | '' => {
    if (!acao) {
      return '';
    }

    return acao.status[acao.status.length - 1]?.status;
  }, [acao]);

  if (!acao || !['em_analise', 'em_andamento'].includes(currentAcaoStatus)) {
    return <Navigate to="/404" replace />;
  }

  const denunciasDaAcao = useMemo(() => {
    return denuncias.filter((d) => d.acao?.id === acao.id);
  }, [denuncias]);

  async function handleVincularDenuncias() {
    if (!acao) return;

    const denunciasSelecionadasIds = new Set(
      denunciasSelecionas.map((d) => d.id),
    );

    const denunciasDataUpdated = denuncias.map((denuncia) => {
      if (denunciasSelecionadasIds.has(denuncia.id)) {
        return { ...denuncia, acaoId: acao.id, status: acao.status };
      }
      return denuncia;
    });

    const todasDenunciasDaAcao = denunciasDataUpdated.filter(
      (d) => d.acao?.id === acao.id,
    );

    const coordinates = todasDenunciasDaAcao.map((d) => ({
      lat: d.latitude,
      lng: d.longitude,
    }));

    const actionCenter = getPolygonoCenter(coordinates);

    const acaoDataUpdated: AcaoModel = {
      ...acao,
      latitude: actionCenter[0],
      longitude: actionCenter[1],
    };

    setDenuncias(denunciasDataUpdated);
    setAcoes((currentAcoes) =>
      currentAcoes.map((a) => (a.id === acao.id ? acaoDataUpdated : a)),
    );

    navigate(`/ocorrencias/acoes/${acao.id}`);
  }

  function resetFiltersAndMapActions() {
    restoreCachedFilters();
    setSalvarDenunciasOnClick(false);
    setDenunciasJaVinculadas([]);
  }

  useEffect(() => {
    cacheCurrentFilters();
    setSalvarDenunciasOnClick(true);
    setIsVisibleAcoesInMap(false);
    setFiltroDenunciasComAcao('sem_acao');
    setFiltroStatusDenuncia(['aberto']);
    setDenunciasJaVinculadas(denunciasDaAcao);

    return () => resetFiltersAndMapActions();
  }, []);

  return (
    <>
      <div className="flex gap-4 flex-col h-full">
        <BackButton to={`/ocorrencias/acoes/${acaoId}`} />

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">Vinculando denúncias á ação:</p>
          <p className="font-bold text-blue-900">{acao.nome}</p>

          <Tag status={currentAcaoStatus} />
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
                {denuncia.tipo.nome}
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
        message={`Você deseja vincular essa ação as denúncias ${denunciasSelecionas
          .map((d) => d.id)
          .join(', ')}?`}
        onCancel={() => setIsOpenConfirmationModal(false)}
        onConfirm={handleVincularDenuncias}
      />
    </>
  );
}
