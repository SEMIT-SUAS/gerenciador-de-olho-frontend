import { Tag } from './../Tag';
import { useEffect, useState } from 'react';
import { ConfirmModal } from '../../Modals/ConfirmModal';
import { FaTrashAlt } from 'react-icons/fa';
import { FilesCarrrousel } from '../../FilesCarrousel';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { BackButton } from '../../Buttons/Backbutton';
import { useMapActions } from '../../../context/MapActions';
import { Button } from '@/components/Buttons/BaseButton';
import { IconProgressX } from '@tabler/icons-react';
import type { DenunciaModel } from '@/types/Denuncia';
import { DenunciaService } from '@/services/DenunciaService';
import { SidePanelLoadingContent } from '@/components/Loading/SidePanelLoadingContent';
import { getDenunciaStatus } from '@/utils/denuncia';

export function DenunciaDetails() {
  const [denuncia, setDenuncia] = useState<DenunciaModel | null>(null);
  const [denunciaFiles, setDenunciaFiles] = useState<string[] | null>(null);
  const [isDesvincularModalOpen, setIsDesvincularModalOpen] = useState(false);
  const { setZoomTo } = useMapActions();

  const navigate = useNavigate();
  const params = useParams();
  const denunciaId = Number(params.denunciaId);

  async function handleConfirmDesvincularDenunciaAcao() {
    try {
      if (!denuncia) throw new Error('Denúncia não encontrada');

      // setDenuncias((current) =>
      //   current.map((d) => {
      //     if (d.id === denuncia.id) {
      //       return {
      //         ...d,
      //         status: 'aberto',
      //       };
      //     }
      //     return d;
      //   }),
      // );

      setIsDesvincularModalOpen(false);
      toast.success('Denúncia desvinculada com sucesso!');
    } catch (error) {
      toast.error('Erro ao desvincular denúncia.');
    }
  }

  useEffect(() => {
    DenunciaService.getById(denunciaId)
      .then((data) => {
        setDenuncia(data);
      })
      .catch(() => {
        navigate('/404');
      });

    DenunciaService.getFilesByDenunciaId(denunciaId)
      .then((data) => {
        setDenunciaFiles(data);
      })
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
  }, [denuncia, denunciaId]);

  if (!denuncia) {
    return <SidePanelLoadingContent />;
  }

  const denunciaStatus = getDenunciaStatus(denuncia);

  return (
    <>
      <div className="flex flex-col gap-2 space-y-4">
        <BackButton
          to="/ocorrencias/denuncias"
          children="Detalhes da Denúncia"
        />

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
                {new Date(denuncia.criadoEm).toLocaleString('pt-BR')}
              </p>
            </div>

            <Tag status={denunciaStatus} />
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
              {denuncia.pontoReferencia.length > 0 && (
                <p className="text-sm text-gray-600">
                  Ponto de Referência: {denuncia.pontoReferencia}
                </p>
              )}
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
                onClick={() => setIsDesvincularModalOpen(true)}
                className="z-10 cursor-pointer rounded-full p-2 text-yellow-800 transition-colors hover:bg-red-100 hover:text-red-600"
                aria-label="Desvincular Ação"
              >
                <FaTrashAlt />
              </button>
            </div>
          )}

          {!denuncia.dadosAcaoParaDenuncia &&
            ['Indeferido', 'Concluído'].includes(denunciaStatus) && (
              <div className="py-3 px-4 rounded-xl border border-gray-200 text-center space-y-2">
                <p className="text-sm font-semibold text-gray-800">
                  Nenhuma ação vinculada
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate('vincular-acao')}
                >
                  Vincular a uma Ação
                </Button>
              </div>
            )}

          {denunciaFiles && denunciaFiles.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Mídia:</h3>
              <div>
                <FilesCarrrousel files={denunciaFiles} />
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
            {denunciaStatus === 'Aberto' && (
              <Button
                variant="outline_danger"
                size="sm"
                onClick={() => navigate('indeferir')}
                className=""
              >
                <IconProgressX className="inline h-4" />
                Indeferir Denúncia
              </Button>
            )}
          </div>
        </>
      </div>

      <ConfirmModal
        isOpen={isDesvincularModalOpen}
        title={'Confirmar Desvinculo'}
        message={`Deseja desvincular a denúncia "${denuncia.tipoDenuncia.nome}" da ação "${denuncia.dadosAcaoParaDenuncia?.nome}"?`}
        onCancel={() => setIsDesvincularModalOpen(false)}
        onConfirm={handleConfirmDesvincularDenunciaAcao}
      />
    </>
  );
}
