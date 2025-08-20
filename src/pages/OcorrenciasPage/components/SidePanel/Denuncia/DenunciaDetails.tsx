import { ConfirmModal } from '@/components/Modals/ConfirmModal';
import { BackButton } from '@/components/ui/Backbutton';
import { useMapActions } from '@/context/MapActions';
import { DenunciaService } from '@/services/DenunciaService';
import type { DenunciaModel } from '@/types/Denuncia';
import { IconProgressX, IconTrash } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Tag } from '../Tag';
import { FilesCarrrousel } from '@/components/FilesCarrousel';
import { Button } from '@/components/ui/button';
import { SidePanelContentSkeleton } from '../SidePanelContentSkeleton';

export function DenunciaDetails() {
  const [denuncia, setDenuncia] = useState<null | DenunciaModel>(null);
  const [
    isOpenDesvincularAcaoConfirmationModal,
    setIsOpenDesvincularAcaoConfirmationModal,
  ] = useState(false);

  const params = useParams();
  const navigate = useNavigate();
  const denunciaId = Number(params.id);

  const { setZoomTo } = useMapActions();

  useEffect(() => {
    DenunciaService.getById(denunciaId)
      .then((denunciaData) => setDenuncia(denunciaData))
      .catch((error: any) => toast.error(error.message));
  }, []);

  useEffect(() => {
    if (denuncia) {
      setZoomTo({
        lat: denuncia.latitude,
        lng: denuncia.longitude,
      });
    }

    return () => setZoomTo(null);
  }, [denuncia]);

  const backButton = (
    <BackButton to="/ocorrencias" children="Detalhes da Denúncia" />
  );

  if (!denuncia) {
    return <SidePanelContentSkeleton backButton={backButton} />;
  }

  function handleDesvincularDenunciaDaAcao() {}

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

            <Tag status={denuncia.dadosAcaoParaDenuncia.status} />
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
            <div className="flex items-center px-4 py-3 justify-between bg-yellow-50 border border-yellow-200 rounded-xl">
              <div>
                <p className="text-sm font-semibold text-yellow-700">
                  Ação Vinculada:
                </p>
                <p className="text-md font-bold text-yellow-900">
                  {denuncia.dadosAcaoParaDenuncia.nome}
                </p>
                <p className="text-xs font-semibold text-yellow-800">
                  {denuncia.dadosAcaoParaDenuncia.secretaria}
                </p>
              </div>
              <button
                onClick={() => setIsOpenDesvincularAcaoConfirmationModal(true)}
                className="z-10 cursor-pointer rounded-full p-2 text-yellow-800 transition-colors hover:bg-red-100 hover:text-red-600"
                aria-label="Desvincular Ação"
              >
                <IconTrash size={18} />
              </button>
            </div>
          )}
          {denuncia.dadosAcaoParaDenuncia &&
            !['Indeferido', 'Concluído'].includes(
              denuncia.dadosAcaoParaDenuncia.status,
            ) && (
              <div className="py-3 px-4 rounded-xl border border-gray-200 text-center space-y-2">
                <p className="text-sm font-semibold text-gray-800">
                  Nenhuma ação vinculada
                </p>
                <Button
                  className="w-full"
                  onClick={() => navigate('vincular-acao')}
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
          {/* AGUARDANDO FUNCIONALIDADE DO BACKEND */}
          {/* {denunciaStatus === 'indeferido' && indeferimentoData && (
            <div className="p-3 bg-red-50 border-l-4 border-red-400 text-red-700">
              <p className="font-bold">Motivo do Indeferimento:</p>
              <p>{indeferimentoData.motivo}</p>
            </div>
          )} */}
          <div className="flex justify-end">
            {!denuncia.dadosAcaoParaDenuncia && (
              <Button onClick={() => navigate('indeferir')}>
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
    </>
  );
}
