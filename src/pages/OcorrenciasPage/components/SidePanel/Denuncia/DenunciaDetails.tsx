import { ConfirmModal } from '@/components/Modals/ConfirmModal';
import { BackButton } from '@/components/ui/Backbutton';
import { useMapActions } from '@/context/MapActions';
import { DenunciaService } from '@/services/DenunciaService';
import type { DenunciaModel } from '@/types/Denuncia';
import {
  IconInfoCircle,
  IconLink,
  IconProgressX,
  IconTrash,
} from '@tabler/icons-react';
import { useEffect, useState, useCallback } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Tag } from '../Tag';
import { FilesCarrrousel } from '@/components/FilesCarrousel';
import { Button } from '@/components/ui/button';
import { SidePanelContentSkeleton } from '../SidePanelContentSkeleton';
import { IndeferirModal } from '../Modals/IndeferirModal';
import { mensagensSugeridasParaIndeferirDenuncia } from '@/constants/messagesRejectComplaint';
import { useAuth } from '@/context/AuthContext';
import { getDenunciaStatus } from '@/utils/status';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { getPolygonoCenter } from '@/utils/geometry';
import AcoesService from '@/services/acoesService';
import type { AcaoDetailsModel } from '@/types/Acao';
import { useFilters } from '@/context/FiltersContext';

export function DenunciaDetails() {
  // --- STATE MANAGEMENT ---
  const [denuncia, setDenuncia] = useState<null | DenunciaModel>(null);
  const [acaoData, setAcaoData] = useState<AcaoDetailsModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenIndeferirModal, setIsOpenIndeferirModal] = useState(false);
  const [isOpenDesvincularModal, setIsOpenDesvincularModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- HOOKS ---
  const params = useParams();
  const navigate = useNavigate();
  const denunciaId = Number(params.id);
  const { setZoomTo, currentBairroId } = useMapActions();
  const { user } = useAuth();
  const { filtrarData } = useFilters();

  // --- DATA FETCHING ---
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const denunciaData = await DenunciaService.getById(denunciaId);
      setDenuncia(denunciaData);

      if (denunciaData.dadosAcaoParaDenuncia?.id) {
        const acaoDetails = await AcoesService.getAcaoById(
          denunciaData.dadosAcaoParaDenuncia.id,
        );
        setAcaoData(acaoDetails);
      } else {
        setAcaoData(null);
      }
    } catch (error: any) {
      toast.error(error.message);
      navigate('/ocorrencias'); // Redireciona se não encontrar a denúncia
    } finally {
      setIsLoading(false);
    }
  }, [denunciaId, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- SIDE EFFECTS ---
  useEffect(() => {
    if (denuncia) {
      setZoomTo({ lat: denuncia.latitude, lng: denuncia.longitude, level: 22 });
    }
    return () => setZoomTo(null);
  }, [denuncia, setZoomTo]);

  // --- HANDLERS ---
  const handleDesvincular = useCallback(async () => {
    if (!denuncia || !acaoData) return;

    setIsSubmitting(true);
    try {
      const denunciasRestantes = acaoData.denuncias.filter(
        (d) => d.id !== denuncia.id,
      );

      let newCenter = {
        latitude: acaoData.acao.latitude,
        longitude: acaoData.acao.longitude,
      };
      if (denunciasRestantes.length > 0) {
        const coordsRestantes = denunciasRestantes.map(
          (d) =>
            [d.endereco.latitude, d.endereco.longitude] as [number, number],
        );
        const center = getPolygonoCenter(coordsRestantes);
        newCenter = { latitude: center[0], longitude: center[1] };
      }

      const payload = {
        id: acaoData.acao.id,
        latitude: newCenter.latitude,
        longitude: newCenter.longitude,
        denuncias: denunciasRestantes.map((d) => d.id), // Envia a lista de IDs restantes
      };

      await AcoesService.updateAcao(payload); // Um método genérico de update seria ideal
      await DenunciaService.desvincularAcao(denuncia.id);
      filtrarData({
        denunciaStatusParam: 'Aberto',
        acaoStatusParam: null,
        tipoDaDenunciaParam: null,
      });

      toast.success('Ação desvinculada com sucesso!');
      await fetchData(); // Recarrega todos os dados para garantir consistência
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
      setIsOpenDesvincularModal(false);
    }
  }, [denuncia, acaoData, fetchData]);

  const handleIndeferir = useCallback(
    async (motivo: string) => {
      if (!denuncia || !user) return;

      setIsSubmitting(true);
      try {
        await DenunciaService.indeferirDenuncia({
          denunciaId,
          motivo,
          userId: user.id,
        });
        toast.success('Denúncia indeferida com sucesso!');
        await fetchData(); // Recarrega os dados
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsSubmitting(false);
        setIsOpenIndeferirModal(false);
      }
    },
    [denuncia, user, denunciaId, fetchData],
  );

  // --- RENDER LOGIC ---
  const backButton = (
    <BackButton to="/ocorrencias" children="Detalhes da Denúncia" />
  );

  if (!currentBairroId) {
    return <Navigate to="/ocorrencias" />;
  }

  if (isLoading) {
    return <SidePanelContentSkeleton backButton={backButton} />;
  }

  if (!denuncia) {
    // Pode mostrar uma mensagem de "Denúncia não encontrada"
    return (
      <div>
        {backButton} <p>Denúncia não encontrada.</p>
      </div>
    );
  }

  const denunciaStatus = getDenunciaStatus(denuncia);

  return (
    <>
      <div className="flex flex-col gap-2 space-y-4">
        {backButton}

        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-semibold text-yellow-700">
              {denuncia.tipoDenuncia.categoria.nome}
            </p>
            <h2 className="text-xl font-bold text-gray-800">
              {denuncia.tipoDenuncia.nome}
            </h2>
            <p className="text-sm text-gray-500">
              Registrado em:{' '}
              {new Date(denuncia.dataInicio).toLocaleString('pt-BR')}
            </p>
          </div>
          <Tag status={denunciaStatus} />
        </div>

        <div>
          <h3 className="font-semibold text-sm text-gray-800">Descrição:</h3>
          <p className="text-sm text-gray-600">{denuncia.descricao}</p>
        </div>

        <div className="flex-col text-gray-700 border border-gray-200 p-4 rounded-2xl space-y-2">
          <h3 className="font-semibold text-gray-800 text-sm">Endereço:</h3>
          <p className="text-sm text-gray-600">
            {denuncia.rua}, {denuncia.bairro}
          </p>
          <p className="text-sm text-gray-600">{denuncia.pontoReferencia}</p>
        </div>

        {denuncia.dadosAcaoParaDenuncia && (
          <Card>
            <CardContent className="flex gap-2 justify-between items-center">
              <div className="flex gap-3 items-center">
                <IconInfoCircle size={24} className="text-blue-500" />
                <div>
                  <CardTitle className="text-base">Ação Vinculada</CardTitle>
                  <CardDescription>
                    {denuncia.dadosAcaoParaDenuncia.nome}
                  </CardDescription>
                  <h4 className="text-xs text-muted-foreground">
                    {denuncia.dadosAcaoParaDenuncia.secretaria}
                  </h4>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  aria-label="Ver detalhes da ação"
                  onClick={() =>
                    navigate(
                      `/ocorrencias/acoes/${denuncia.dadosAcaoParaDenuncia?.id}`,
                    )
                  }
                >
                  <IconLink />
                </Button>
                <Button
                  size="icon"
                  aria-label="Desvincular ação"
                  disabled={isSubmitting}
                  onClick={() => setIsOpenDesvincularModal(true)}
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <IconTrash />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!denuncia.dadosAcaoParaDenuncia &&
          !['Indeferido', 'Concluído'].includes(denunciaStatus) && (
            <div className="py-3 px-4 rounded-xl border border-gray-200 text-center space-y-2">
              <p className="text-sm font-semibold text-gray-800">
                Nenhuma ação vinculada
              </p>
              <Button
                className="w-full"
                onClick={() => navigate(`vincular-denuncia`)}
              >
                Vincular a uma Ação
              </Button>
            </div>
          )}

        {denuncia.urls.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Mídia:</h3>
            <FilesCarrrousel filesURLs={denuncia.urls} />
          </div>
        )}

        {denunciaStatus === 'Indeferido' && denuncia.denunciaIndeferida && (
          <div className="p-3 bg-red-50 border-l-4 border-red-400 text-red-700">
            <p className="font-bold">Motivo do Indeferimento:</p>
            <p>{denuncia.denunciaIndeferida.motivo}</p>
          </div>
        )}

        <div className="flex justify-end">
          {!denuncia.dadosAcaoParaDenuncia &&
            denunciaStatus !== 'Indeferido' && (
              <Button onClick={() => setIsOpenIndeferirModal(true)}>
                <IconProgressX className="inline h-4 mr-2" />
                Indeferir Denúncia
              </Button>
            )}
        </div>
      </div>

      <ConfirmModal
        isOpen={isOpenDesvincularModal}
        title={'Confirmar Desvínculo'}
        message={`Deseja desvincular a denúncia "${denuncia.tipoDenuncia.nome}" da ação "${denuncia.dadosAcaoParaDenuncia?.nome}"?`}
        onCancel={() => setIsOpenDesvincularModal(false)}
        onConfirm={handleDesvincular}
      />

      <IndeferirModal
        isOpen={isOpenIndeferirModal}
        isIndeferindoItem={isSubmitting}
        title={`Deseja indeferir a denúncia ${denuncia.tipoDenuncia.nome}?`}
        onCancel={() => setIsOpenIndeferirModal(false)}
        onConfirm={handleIndeferir}
        suggestionMessages={mensagensSugeridasParaIndeferirDenuncia}
      />
    </>
  );
}
