import { useNavigate, useParams } from 'react-router-dom';
import { BackButton } from '../../../../../components/ui/Backbutton';
import { useContext, useEffect, useMemo, useState } from 'react';
import { ConfirmModal } from '../../../../../components/Modals/ConfirmModal';
import { FaMapPin } from 'react-icons/fa';
import { useFilters } from '@/context/FiltersContext';
import { useMapActions } from '../../../../../context/MapActions';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import AcoesService from '@/services/acoesService';
import { DenunciaService } from '@/services/DenunciaService';
import type { DenunciaModel } from '@/types/Denuncia';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

export function VincularDenunciaAAcao() {
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);

  const { setIsVisibleDenunciasInMap, updateAcao, setIsVisibleAcoesInMap } =
    useFilters();
  const [denuncia, setDenuncia] = useState<DenunciaModel>();

  const { setSalvarAcaoOnclick, acaoSelecionada, setAcaoSelecionada } =
    useMapActions();

  const params = useParams();
  const denunciaId = Number(params.id);
  const navigate = useNavigate();

  async function fetchDenuncia() {
    try {
      const denuncia = await DenunciaService.getById(denunciaId);
      setDenuncia(denuncia);
    } catch (error) {
      toast.error('Erro ao buscar denúncia.');
      console.error(error);
      return null;
    }
  }

  useEffect(() => {
    setIsVisibleDenunciasInMap(false);
    setIsVisibleAcoesInMap(true);
    fetchDenuncia();
    return () => {
      setIsVisibleDenunciasInMap(true);
    };
  }, [denunciaId, setIsVisibleDenunciasInMap, setIsVisibleAcoesInMap]);

  // useEffect(() => {
  //   const filtroOriginal = filtroStatusDenuncia;

  //   setFiltroStatusDenuncia('Análise');

  //   return () => {
  //     setFiltroStatusDenuncia(filtroOriginal);
  //   };
  // }, []);

  // useEffect(() => {
  //   fetchDataFiltrada();
  // }, [filtroStatusDenuncia, fetchDataFiltrada]);

  useEffect(() => {
    setSalvarAcaoOnclick(true);
    return () => {
      setSalvarAcaoOnclick(false);
      setAcaoSelecionada(null);
    };
  }, [setSalvarAcaoOnclick, setAcaoSelecionada]);

  async function handleVincularDenuncia() {
    if (!denuncia || !acaoSelecionada) {
      toast.error('Por favor, selecione uma denúncia e uma ação.');
      return;
    }

    try {
      setIsOpenConfirmationModal(false);

      const denunciasJaVinculadasIds = acaoSelecionada.denuncias.map(
        (d) => d.id,
      );

      const payload = {
        acaoId: acaoSelecionada.id,
        denuncias: [...denunciasJaVinculadasIds, denunciaId],
      };
      const acaoAtualizada = await AcoesService.vincularDenunciaAcao(payload);

      updateAcao(acaoAtualizada);

      navigate(`/ocorrencias/acoes/${acaoSelecionada.id}`);
      toast.success('Denúncia vinculada com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Falha ao vincular denúncia.');
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
          <p className="font-bold text-blue-900">
            {denuncia?.tipoDenuncia.nome}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-gray-800">Ação selecionada:</h3>
          {acaoSelecionada ? (
            <div>
              <span>{acaoSelecionada.nome}</span>
              <span>{acaoSelecionada.criadoEm}</span>
              <span>{acaoSelecionada.siglaSecretaria}</span>
              <span>
                {acaoSelecionada.denuncias.map((denuncia) => (
                  <Card>
                    <CardHeader className="flex items-center justify-between">
                      <CardTitle>{denuncia.nomeTipoDenuncia}</CardTitle>
                      <CardDescription></CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </span>
            </div>
          ) : (
            <span>Selecione uma ação uma ação no mapa</span>
          )}
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
        message={`Você deseja vincular essa denúncia ${denuncia?.tipoDenuncia.nome} à essa ação ${acaoSelecionada?.nome}?`}
        onCancel={() => setIsOpenConfirmationModal(false)}
        onConfirm={handleVincularDenuncia}
      />
    </>
  );
}
