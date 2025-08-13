import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useOcorrencias } from '../../../../../context/OcorrenciasContext';
import { DenunciaManageInAction } from '../Denuncia/DenunciaManagerInAction';
import { BackButton } from '../../../../../components/ui/Backbutton';
import { FaInfoCircle } from 'react-icons/fa';
import { useMapActions } from '../../../../../context/MapActions';
import { Tag } from '../Tag';
import type { AcaoStatusModelTypes } from '../../../../../types/AcaoStatus';
import { useFilters } from '../../../../../context/FiltersContext';
import { Button } from '@/components/ui/button';
import { IconProgressX } from '@tabler/icons-react';
import { FilesCarrrousel } from '@/components/FilesCarrousel';
import { IoIosAdd } from 'react-icons/io';
import { IconCircleCheckFilled } from '@tabler/icons-react';
import { handleIniciarAcao } from './IniciarAcao';
import { ConfirmModal } from '@/components/Modals/ConfirmModal';

export function AcaoDetails() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { acoes, denuncias, setAcoes, setDenuncias } = useOcorrencias();
  const { setZoomTo } = useMapActions();
  const { cacheCurrentFilters, restoreCachedFilters, setFiltroStatusDenuncia } =
    useFilters();

  const params = useParams();
  const navigate = useNavigate();
  const acaoId = params.acaoId;

  const acao = useMemo(() => {
    return acoes.find((ac) => ac.id === Number(acaoId));
  }, [acaoId, acoes]);

  const currentAcaoStatus = useMemo((): AcaoStatusModelTypes | null => {
    if (!acao) {
      return null;
    }

    return acao.status[acao.status.length - 1]?.status;
  }, [acao]);

  const denunciasVinculadas = useMemo(() => {
    if (!acao) return [];

    return denuncias.filter((d) => d.acao?.id === acao.id);
  }, [denuncias, acao]);

  const onConfirmarInicio = () => {
    handleIniciarAcao({
      acao,
      setAcoes,
      setDenuncias,
    });
    setIsModalOpen(false); // Fecha o modal
  };

  useEffect(() => {
    cacheCurrentFilters();

    setFiltroStatusDenuncia('todos');
    return () => {
      restoreCachedFilters();
    };
  }, []);

  useEffect(() => {
    if (acao) {
      setZoomTo({
        lat: acao.latitude,
        lng: acao.longitude,
      });
    }

    return () => setZoomTo(null);
  }, [acao, setZoomTo]);

  if (!acao || !currentAcaoStatus) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="flex flex-col h-full space-y-7">
      <BackButton to="/ocorrencias/acoes" children="Detalhes da Ação" />
      <div className="flex-shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">
              Responsável: {acao.secretaria.sigla}
            </p>
            <h1 className="text-2xl font-bold text-gray-800">{acao.nome}</h1>
            <p className="text-sm text-gray-500">
              Criada em: {new Date(acao.criadoEm).toLocaleString('pt-BR')}
            </p>
          </div>
          <Tag status={currentAcaoStatus} />
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

        {acao.obs && (
          <div>
            <h3 className="font-semibold text-sm text-gray-800">Descrição:</h3>
            <p className="text-sm text-gray-600">{acao.obs}</p>
          </div>
        )}
        {currentAcaoStatus === 'em_analise' && (
          <Button
            onClick={() => setIsModalOpen(true)} // Abre o modal
            className="w-full"
          >
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

              {!['indeferido', 'concluido'].includes(currentAcaoStatus) && (
                <button
                  onClick={() => navigate('vincular-denuncias')}
                  className="bg-blue-500 rounded-full p-1 hover:bg-blue-600 transition-colors"
                >
                  <IoIosAdd size={24} color="white" />
                </button>
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
                    ['em_analise', 'em_andamento'].includes(currentAcaoStatus);

                  return (
                    <DenunciaManageInAction
                      key={denuncia.id}
                      denuncia={denuncia}
                      allowDisvincularItem={canDisvincular}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-800 mb-1">Mídias:</h3>
        <FilesCarrrousel
          files={denunciasVinculadas.flatMap((denuncia) =>
            denuncia.files.map((file) => ({
              ...file,
              nome: file.nome,
              tipo:
                file.tipo ?? (file.nome.includes('.mp4') ? 'video' : 'imagem'),
            })),
          )}
        />
      </div>

      <footer className="flex flex-col gap-2 flex-shrink-0">
        {['em_analise', 'em_andamento'].includes(currentAcaoStatus) && (
          <div className="flex gap-1">
            <Button
              onClick={() => navigate('concluir')}
              className="flex justify-center items-center w-full"
            >
              <IconCircleCheckFilled className="inline h-4" />
              Concluir Ação
            </Button>

            <Button
              onClick={() => navigate('indeferir')}
              className="flex justify-center items-center w-60"
            >
              <IconProgressX className="inline h-4" />
              Indeferir Ação
            </Button>
          </div>
        )}
      </footer>
      <ConfirmModal
        isOpen={isModalOpen}
        title="Iniciar Ação"
        message="Tem certeza de que deseja mover esta ação para 'Em Andamento'?"
        onConfirm={onConfirmarInicio}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
}
