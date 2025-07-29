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
import { toast } from 'react-toastify';
import { DenunciaItem } from '../Denuncia/DenunciaItem';
import { Button } from '@/components/Buttons/BaseButton';

export function VincularAcaoADenuncias() {
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);
  const {
    denunciasSelecionas,
    addDenunciaNaSelecao,
    setSalvarDenunciasOnClick,
    setDenunciasJaVinculadas,
    setDenunciasSelecionadas,
  } = useMapActions();
  const { acoes, denuncias, setDenuncias, setAcoes } = useOcorrencias();
  const {
    denunciasFiltradas,
    setFiltroDenunciasComAcao,
    setFiltroStatusDenuncia,
    cacheCurrentFilters,
    restoreCachedFilters,
    setIsVisibleAcoesInMap,
    setIsVisibleDenunciasInMap,
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
    try {
      if (!acao) return;

      setDenuncias((prevDenuncias) => {
        const denunciasSelecionadasIds = new Set(
          denunciasSelecionas.map((d) => d.id),
        );

        const updatedDenuncias = prevDenuncias.map((d) =>
          denunciasSelecionadasIds.has(d.id)
            ? {
                ...d,
                acao,
              }
            : d,
        );

        const newCenterCoordinates = getPolygonoCenter(
          updatedDenuncias
            .filter((d) => d.acao?.id === acao.id)
            .map((d) => [d.latitude, d.longitude]),
        );

        setAcoes((prevAcoes) =>
          prevAcoes.map((a) => {
            if (a.id === acao.id) {
              return {
                ...a,
                latitude: newCenterCoordinates[0],
                longitude: newCenterCoordinates[1],
              };
            }

            return a;
          }),
        );

        return updatedDenuncias;
      });

      toast.success('Denúncias vinculadas com sucesso!');
      navigate(`/ocorrencias/acoes/${acao.id}`);
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  function resetFiltersAndMapActions() {
    restoreCachedFilters();
    setSalvarDenunciasOnClick(false);
    setDenunciasJaVinculadas([]);
    setDenunciasSelecionadas([]);
  }

  useEffect(() => {
    cacheCurrentFilters();
    setSalvarDenunciasOnClick(true);
    setIsVisibleAcoesInMap(false);
    setIsVisibleDenunciasInMap(true);
    setFiltroDenunciasComAcao('sem_acao');
    setFiltroStatusDenuncia(['aberto']);
    setDenunciasJaVinculadas(denunciasDaAcao);

    console.log(denunciasFiltradas);

    return () => resetFiltersAndMapActions();
  }, []);

  return (
    <>
      <div className="flex gap-4 flex-col h-full">
        <BackButton
          to={`/ocorrencias/acoes/${acaoId}`}
          children="Vincular Denúncias"
        />

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">Vinculando denúncias á ação:</p>
          <p className="font-bold text-blue-900">{acao.nome}</p>
          <p className="text-sm text-blue-900 font-semibold">
            Responsável: {acao.secretaria.sigla}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-gray-800">
            Selecione denuncias existentes:
          </h3>

          <div className="flex flex-col gap-2 p-2 rounded-lg overflow-y-auto max-h-120">
            {denunciasFiltradas.map((denuncia) => (
              <DenunciaItem
                showTag={false}
                showDate={true}
                isSelected={denunciasSelecionas.some(
                  (d) => d.id === denuncia.id,
                )}
                key={denuncia.id}
                denuncia={denuncia}
                onClick={() => addDenunciaNaSelecao(denuncia)}
                isDeletable={false}
              />
            ))}
          </div>
        </div>

        <Button
          size="md"
          onClick={() => setIsOpenConfirmationModal(true)}
          disabled={denunciasSelecionas.length < 1}
        >
          Víncular á ação
        </Button>
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
