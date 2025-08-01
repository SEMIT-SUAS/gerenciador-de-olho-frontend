import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { BackButton } from '../../Buttons/Backbutton';
import { useEffect, useMemo, useState } from 'react';
import { ConfirmModal } from '../../Modals/ConfirmModal';
import { FaMapPin } from 'react-icons/fa';
import { useFilters } from '../../../context/FiltersContext';
import { useMapActions } from '../../../context/MapActions';
import { useOcorrencias } from '../../../context/OcorrenciasContext';
import { toast } from 'sonner';
// import denunciasService from '@/services/denunciasService';
import { getPolygonoCenter } from '@/utils/geometry';
import type { DenunciaModel } from '@/types/Denuncia';
import { Button } from '@/components/Buttons/BaseButton';

export function VincularDenunciaAAcao() {
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);
  const { setDenuncias, denuncias, setAcoes } = useOcorrencias();
  const {
    setIsVisibleDenunciasInMap,
    setIsVisibleAcoesInMap,
    setFiltroStatusAcao,
    setFiltroCategoria,
    cacheCurrentFilters,
    restoreCachedFilters,
    acoesFiltradas,
  } = useFilters();
  const {
    setSalvarAcaoOnclick,
    acaoSelecionada,
    setAcaoSelecionada,
    toggleAcaoSelecionada,
  } = useMapActions();

  const params = useParams();
  const denunciaId = params.denunciaId;
  const navigate = useNavigate();

  const denuncia = useMemo(() => {
    return denuncias.find((d) => d.id == Number(denunciaId));
  }, [denuncias, denunciaId]);

  useEffect(() => {
    cacheCurrentFilters();

    setSalvarAcaoOnclick(true);
    setIsVisibleDenunciasInMap(false);
    setIsVisibleAcoesInMap(true);
    setFiltroCategoria('todas');
    setFiltroStatusAcao(['em_analise', 'em_andamento']);

    return () => {
      setSalvarAcaoOnclick(false);
      restoreCachedFilters();
      setAcaoSelecionada(null);
    };
  }, []);

  if (!denuncia || denuncia.acao != null) {
    return <Navigate to="404" replace />;
  }

  async function handleVincularDenuncia() {
    try {
      // const denunciaUpdatedData = await denunciasService.vincularDenunciaToAcao(
      //   denuncia?.id!,
      //   acaoSelecionada?.id!,
      // );

      const denunciaUpdatedData: DenunciaModel = {
        ...denuncia!,
        acao: acaoSelecionada!,
      };

      setDenuncias((prevDenuncias) => {
        const updatedDenuncias = prevDenuncias.map((d) =>
          d.id === denuncia?.id ? denunciaUpdatedData : d,
        );

        const denunciasVinculadas = updatedDenuncias.filter(
          (d) => d.acao?.id === acaoSelecionada?.id,
        );

        const centerAcao = getPolygonoCenter(
          denunciasVinculadas.map((d) => [d.latitude, d.longitude]),
        );

        setAcoes((prevAcoes) =>
          prevAcoes.map((acao) =>
            acao.id === acaoSelecionada?.id
              ? {
                  ...acao,
                  latitude: centerAcao[0],
                  longitude: centerAcao[1],
                }
              : acao,
          ),
        );

        return updatedDenuncias;
      });

      navigate(`/ocorrencias/acoes/${acaoSelecionada?.id}`);
      toast.success('Denúncia vinculada com sucesso!');
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <>
      <div className="flex gap-4 flex-col h-full">
        <BackButton
          to={`/ocorrencias/denuncias/${denunciaId}`}
          children="Vincular Denúncia"
        />

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">Vinculando denúncia:</p>
          <p className="font-bold text-blue-900">{denuncia.tipo.nome}</p>
          <p className="flex text-xs text-blue-800 mt-1">
            <span className="mr-1">
              <FaMapPin />
            </span>
            {`${denuncia.rua}, ${denuncia.bairro}`}
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
                onClick={() => toggleAcaoSelecionada(acao)}
                className={`w-full text-left p-3 ${
                  acao.id == acaoSelecionada?.id
                    ? 'bg-gray-300'
                    : 'bg-white hover:bg-gray-100'
                } rounded-lg shadow-sm transition-colors cursor-pointer`}
              >
                <p className="font-semibold text-gray-700">{acao.nome}</p>
                <p className="text-xs font-semibold text-gray-300">
                  {acao.secretaria.nome}
                </p>
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={() => setIsOpenConfirmationModal(true)}
          disabled={!acaoSelecionada}
        >
          Víncular á ação
        </Button>
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
