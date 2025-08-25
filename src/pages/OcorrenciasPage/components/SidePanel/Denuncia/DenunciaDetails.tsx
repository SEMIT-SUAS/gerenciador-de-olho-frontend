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
import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Tag } from '../Tag';
import { FilesCarrrousel } from '@/components/FilesCarrousel';
import { Button } from '@/components/ui/button';
import { SidePanelContentSkeleton } from '../SidePanelContentSkeleton';
import { IndeferirModal } from '../Modals/IndeferirModal';
import { mensagensSugeridasParaIndeferirDenuncia } from '@/constants/messagesRejectComplaint';
import { useAuth } from '@/context/AuthContext';
import type { DenunciaIndeferidaModel } from '@/types/DenunciaIndeferidaModel';
import { getDenunciaStatus } from '@/utils/status';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export function DenunciaDetails() {
  const [denuncia, setDenuncia] = useState<null | DenunciaModel>(null);
  const [
    isOpenDesvincularAcaoConfirmationModal,
    setIsOpenDesvincularAcaoConfirmationModal,
  ] = useState(false);

  const [isOpenIndeferirDenunciaModal, setIsOpenIndeferirDenunciaModal] =
    useState(false);

  const [isIndeferindoDenuncia, setIsIndeferindoDenuncia] = useState(false);

  const [isDesvinculandoAcaoDaDenuncia, setIsDesvinculandoAcaoDaDenuncia] =
    useState(false);

  const params = useParams();
  const navigate = useNavigate();
  const denunciaId = Number(params.id);

  const { setZoomTo, currentBairroId } = useMapActions();
  const { user } = useAuth();

  useEffect(() => {
    DenunciaService.getById(denunciaId)
      .then((denunciaData) => setDenuncia(denunciaData))
      .catch((error: any) => toast.error(error.message));

    return () => {
      setDenuncia(null);
    };
  }, [denunciaId]);

  useEffect(() => {
    if (denuncia) {
      setZoomTo({
        lat: denuncia.latitude,
        lng: denuncia.longitude,
        level: 15,
      });
    }

    return () => setZoomTo(null);
  }, [denuncia]);

  const backButton = (
    <BackButton to="/ocorrencias" children="Detalhes da Denúncia" />
  );

  if (!currentBairroId) {
    return <Navigate to="/ocorrencias" />;
  }

  if (!denuncia) {
    return <SidePanelContentSkeleton backButton={backButton} />;
  }

  async function handleDesvincularDenunciaDaAcao() {
    if (!denuncia) return;

    try {
      setIsDesvinculandoAcaoDaDenuncia(true);

      await DenunciaService.desvincularAcao(denunciaId);

      setDenuncia({
        ...denuncia,
        dadosAcaoParaDenuncia: null,
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsDesvinculandoAcaoDaDenuncia(false);
    }
  }

  async function handleIndeferirDenuncia(motivo: string) {
    if (!denuncia) return;

    try {
      setIsIndeferindoDenuncia(true);
      const indeferimentoData: DenunciaIndeferidaModel =
        await DenunciaService.indeferirDenuncia({
          denunciaId,
          motivo,
          userId: user?.id!,
        });

      setDenuncia({
        ...denuncia,
        denunciaIndeferida: indeferimentoData,
      });

      setIsOpenIndeferirDenunciaModal(false);
    } catch (error: any) {
      setIsOpenIndeferirDenunciaModal(false);
      toast.error(error.message);
    } finally {
      setIsIndeferindoDenuncia(false);
    }
  }

  const denunciaStatus = getDenunciaStatus(denuncia);

  return (
    <>
      <div className="flex flex-col gap-2 space-y-4">
        {backButton}

        <>
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
            <Tag status={denunciaStatus} />{' '}
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-800">Descrição:</h3>
            <p className="text-sm text-gray-600">{denuncia.descricao}</p>
          </div>
          <div className="flex-col text-gray-700 border border-gray-200 p-4 rounded-2xl space-y-2">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Endereço:</h3>
              <p className="text-sm text-gray-600">
                {denuncia.rua}, {denuncia.bairro}
              </p>
              <p className="text-sm text-gray-600">
                {denuncia.pontoReferencia}
              </p>
            </div>
          </div>

          {denuncia.dadosAcaoParaDenuncia && (
            <Card>
              <CardContent className="flex gap-2 justify-between">
                <div className="flex gap-2">
                  <IconInfoCircle size={32} />
                  <div className="flex flex-col gap-2">
                    <CardTitle>Ação Vinculada</CardTitle>
                    <CardDescription>
                      {denuncia.dadosAcaoParaDenuncia.nome}
                      <h4 className={cn('text-[12px]')}>
                        {denuncia.dadosAcaoParaDenuncia.secretaria}
                      </h4>
                    </CardDescription>
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
                    disabled={isDesvinculandoAcaoDaDenuncia}
                    onClick={() =>
                      setIsOpenDesvincularAcaoConfirmationModal(true)
                    }
                  >
                    {isDesvinculandoAcaoDaDenuncia ? (
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
              <div>
                <FilesCarrrousel filesURLs={denuncia.urls} />
              </div>
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
              denunciaStatus != 'Indeferido' && (
                <Button onClick={() => setIsOpenIndeferirDenunciaModal(true)}>
                  <IconProgressX className="inline h-4" />
                  Indeferir Denúncia
                </Button>
              )}
          </div>
        </>
      </div>

      <ConfirmModal
        isOpen={isOpenDesvincularAcaoConfirmationModal}
        title={'Confirmar Desvinculo'}
        message={`Deseja desvincular a denúncia "${denuncia.tipoDenuncia.nome}" da ação "${denuncia.dadosAcaoParaDenuncia?.nome}"?`}
        onCancel={() => setIsOpenDesvincularAcaoConfirmationModal(false)}
        onConfirm={handleDesvincularDenunciaDaAcao}
      />

      <IndeferirModal
        isOpen={isOpenIndeferirDenunciaModal}
        isIndeferindoItem={isIndeferindoDenuncia}
        title={`Deseja indefer a denúncia ${denuncia.tipoDenuncia.nome}?`}
        onCancel={() => setIsOpenIndeferirDenunciaModal(false)}
        onConfirm={handleIndeferirDenuncia}
        suggestionMessages={mensagensSugeridasParaIndeferirDenuncia}
      />
    </>
  );
}
