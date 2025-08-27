import { useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { DenunciaManageInAction } from '../Denuncia/DenunciaManagerInAction';
import { BackButton } from '../../../../../components/ui/Backbutton';
import { FaInfoCircle } from 'react-icons/fa';
import { Tag } from '../Tag';
import { IconPlus, IconProgressX } from '@tabler/icons-react';
import { FilesCarrrousel } from '@/components/FilesCarrousel';
import { IconCircleCheckFilled } from '@tabler/icons-react';
import { SidePanelContentSkeleton } from '../SidePanelContentSkeleton';
import { toast } from 'sonner';
import AcoesService from '@/services/acoesService';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ConcluirAcaoModal } from './ConcluirAcao';
import { IndeferirAcaoModal } from './IndefirirAcao';
import type { AcaoDetailsModel, AcaoHistory } from '@/types/Acao';
import { useAuth } from '@/context/AuthContext';
import { ConfirmModal } from '@/components/Modals/ConfirmModal';
import { Timeline } from './Timeline';

export function AcaoDetails() {
  const [acaoData, setAcaoData] = useState<AcaoDetailsModel | null>(null);
  const [isConcluirModalOpen, setIsConcluirModalOpen] = useState(false);
  const [isIndeferirModalOpen, setIsIndeferirModalOpen] = useState(false);
  const [isIniciarAcaoOpen, setIsIniciarAcaoOpen] = useState(false);
  const [acaoHistory, setAcaoHistory] = useState<AcaoHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const navigate = useNavigate();
  const acaoId = Number(params.id);
  const { user } = useAuth();

  const fetchAcaoDetails = useCallback(async () => {
    setIsLoading(true); // Inicia o carregamento
    try {
      const [acaoDetails, history] = await Promise.all([
        AcoesService.getAcaoById(acaoId),
        AcoesService.getAcaoHistory(acaoId),
      ]);
      setAcaoData(acaoDetails);
      setAcaoHistory(history);
    } catch (error: any) {
      toast.error(error.message);
      // Se der erro, talvez redirecionar ou mostrar uma mensagem
      navigate('/ocorrencias');
    } finally {
      setIsLoading(false); // Finaliza o carregamento
    }
  }, [acaoId, navigate]);

  // Carrega os dados iniciais
  useEffect(() => {
    fetchAcaoDetails();
  }, [fetchAcaoDetails]);

  const backButton = (
    <BackButton to="/ocorrencias" children="Detalhes da Ação" />
  );

  // O esqueleto de carregamento agora é controlado pelo isLoading
  if (isLoading || !acaoData) {
    return <SidePanelContentSkeleton backButton={backButton} />;
  }

  const { acao, denuncias: denunciasVinculadas } = acaoData;
  const urls = denunciasVinculadas.flatMap((denuncia) => denuncia.urls);

  const handleDesvincularDenuncia = (denunciaId: number) => {
    const denunciasAtualizadas = denunciasVinculadas.filter(
      (d) => d.id !== denunciaId,
    );
    setAcaoData({ ...acaoData, denuncias: denunciasAtualizadas });
  };

  const handleIniciarAcao = async () => {
    const payload = {
      id: acao.id,
      acaoStatus: {
        status: 'Andamento',
        motivo: 'Iniciando Ação',
        gerenciador: user!.id,
      },
      ativo: true,
    };

    try {
      await AcoesService.updateAcao(payload);
      toast.success('Ação iniciada com sucesso!');
      await fetchAcaoDetails();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsIniciarAcaoOpen(false);
    }
  };

  const handleUpdateSuccess = async () => {
    setIsConcluirModalOpen(false);
    setIsIndeferirModalOpen(false);
    await fetchAcaoDetails();
  };

  return (
    <div className="flex flex-col h-full space-y-7">
      {backButton}

      <div className="flex-shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">
              Responsável: {acao.siglaSecretaria}
            </p>
            <h1 className="text-2xl font-bold text-gray-800">{acao.nome}</h1>
            <p className="text-sm text-gray-500">
              Criada em: {new Date(acao.criadoEm).toLocaleString('pt-BR')}
            </p>
          </div>
          <Tag status={acao.acaoStatus.status} />
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {denunciasVinculadas.length > 0 && (
          <div className="flex items-center p-3 bg-blue-50 rounded-xl border border-blue-200">
            <FaInfoCircle className="text-blue-500 mr-3 flex-shrink-0" />
            <p className="text-sm font-semibold text-blue-800">
              Esta ação possui uma área de cobertura (polígono) no mapa.
            </p>
          </div>
        )}

        {acao.descricao.length > 1 && (
          <div>
            <h3 className="font-semibold text-sm text-gray-800">Descrição:</h3>
            <p className="text-sm text-gray-600">{acao.descricao}</p>
          </div>
        )}

        {acao.acaoStatus.status === 'Análise' && (
          <Button onClick={() => setIsIniciarAcaoOpen(true)} className="w-full">
            Iniciar ação
          </Button>
        )}

        <div
          className="w-full rounded-xl  bg-gray-50 p-4 flex flex-col border border-gray-200 "
          style={{ maxHeight: '450px' }}
        >
          <div className="flex-shrink-0 pb-4">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold text-md text-gray-800">
                Denúncias Vinculadas
              </h1>

              {!['Indeferido', 'Concluído'].includes(
                acao.acaoStatus.status,
              ) && (
                <Button
                  onClick={() => navigate('vincular-acao')}
                  size="icon"
                  className="rounded-full"
                >
                  <IconPlus className="size-5 font-extrabold" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar-blue">
            {denunciasVinculadas.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">Nenhuma denúncia vinculada.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {denunciasVinculadas.map((denuncia) => {
                  const canDisvincular =
                    denunciasVinculadas.length > 1 &&
                    ['Análise', 'Andamento'].includes(acao.acaoStatus.status);

                  return (
                    <DenunciaManageInAction
                      key={denuncia.id}
                      denuncia={denuncia}
                      allowDisvincularItem={canDisvincular}
                      onDisvincular={handleDesvincularDenuncia}
                      acao={acaoData}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {urls.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-1">Mídias:</h3>
          <FilesCarrrousel filesURLs={urls} />
        </div>
      )}

      {['Análise', 'Andamento'].includes(acao.acaoStatus.status) && (
        <footer className="flex items-center gap-2">
          {/* O botão agora abre o modal */}
          <Button
            onClick={() => setIsConcluirModalOpen(true)}
            className={cn('flex-1')}
          >
            <IconCircleCheckFilled />
            Concluir Ação
          </Button>

          <Button
            onClick={() => setIsIndeferirModalOpen(true)} // 3. Abrir o modal de indeferir
            className={cn('flex-2')}
            variant="destructive"
          >
            <IconProgressX className="inline h-4" />
            Indeferir Ação
          </Button>
        </footer>
      )}

      {acaoHistory.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-4 mt-6">
            Histórico de Alterações
          </h3>
          <Timeline acaoHistory={acaoHistory} />
        </div>
      )}

      {acao && (
        <ConcluirAcaoModal
          isOpen={isConcluirModalOpen}
          onClose={() => setIsConcluirModalOpen(false)}
          acao={acaoData.acao}
          onSuccess={handleUpdateSuccess}
        />
      )}

      {acao && (
        <IndeferirAcaoModal
          isOpen={isIndeferirModalOpen}
          onClose={() => setIsIndeferirModalOpen(false)}
          acao={acao}
          onSuccess={handleUpdateSuccess}
        />
      )}

      {acao.acaoStatus.status === 'Análise' && (
        <ConfirmModal
          isOpen={isIniciarAcaoOpen}
          onCancel={() => setIsIniciarAcaoOpen(false)}
          title="Deseja iniciar essa ação?"
          message='Você está prestes a iniciar uma ação, seu status será "Em Andamento". Esta ação não pode ser desfeita.'
          onConfirm={handleIniciarAcao}
        />
      )}
    </div>
  );
}
