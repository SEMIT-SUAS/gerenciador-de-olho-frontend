import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { DenunciaManageInAction } from '../Denuncia/DenunciaManagerInAction';
import { BackButton } from '../../../../../components/ui/Backbutton';
import { FaInfoCircle } from 'react-icons/fa';
import { Tag } from '../Tag';
import { IconPlus, IconProgressX } from '@tabler/icons-react';
import { FilesCarrrousel } from '@/components/FilesCarrousel';
import { IoIosAdd } from 'react-icons/io';
import { IconCircleCheckFilled } from '@tabler/icons-react';
import { ConfirmModal } from '@/components/Modals/ConfirmModal';
import type { AcaoModel } from '@/types/Acao';
import { SidePanelContentSkeleton } from '../SidePanelContentSkeleton';
import { toast } from 'sonner';
import AcoesService from '@/services/acoesService';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function AcaoDetails() {
  const [acao, setAcao] = useState<AcaoModel | null>(null);

  const params = useParams();
  const navigate = useNavigate();
  const acaoId = Number(params.id);

  useEffect(() => {
    AcoesService.getAcaoById(acaoId)
      .then((acaoData) => setAcao(acaoData))
      .catch((error: any) => toast.error(error.message));
  }, []);

  const backButton = (
    <BackButton to="/ocorrencias" children="Detalhes da Ação" />
  );

  if (!acao) {
    return <SidePanelContentSkeleton backButton={backButton} />;
  }

  const urls = acao.denuncias.flatMap((denuncia) => denuncia.urls);

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
        {acao.denuncias.length > 0 && (
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
          <Button className="w-full">Iniciar ação</Button>
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
                  onClick={() => navigate('vincular-denuncias')}
                  size="icon"
                  className="rounded-full"
                >
                  <IconPlus className="size-5 font-extrabold" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar-blue">
            {acao.denuncias.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">Nenhuma denúncia vinculada.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {acao.denuncias.map((denuncia) => {
                  const canDisvincular =
                    acao.denuncias.length > 1 &&
                    ['Análise', 'Andamento'].includes(acao.acaoStatus.status);

                  return (
                    // <DenunciaManageInAction
                    //   key={denuncia.id}
                    //   denuncia={denuncia}
                    //   allowDisvincularItem={canDisvincular}
                    // />
                    <h1>Teste</h1>
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
          <Button onClick={() => navigate('concluir')} className={cn('flex-1')}>
            <IconCircleCheckFilled />
            Concluir Ação
          </Button>

          <Button
            onClick={() => navigate('indeferir')}
            className={cn('flex-2')}
            variant="destructive"
          >
            <IconProgressX className="inline h-4" />
            Indeferir Ação
          </Button>
        </footer>
      )}

      {/* <ConfirmModal
        isOpen={isModalOpen}
        title="Iniciar Ação"
        message="Tem certeza de que deseja mover esta ação para 'Em Andamento'?"
        onConfirm={onConfirmarInicio}
        onCancel={() => setIsModalOpen(false)}
      /> */}
    </div>
  );
}
