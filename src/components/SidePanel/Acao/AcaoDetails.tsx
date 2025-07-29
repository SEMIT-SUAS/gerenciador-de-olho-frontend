import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { useOcorrencias } from '../../../context/OcorrenciasContext';
import { DenunciaManageInAction } from '../Denuncia/DenunciaManagerInAction';
import { BackButton } from '../../Buttons/Backbutton';
import { FaInfoCircle } from 'react-icons/fa';
import { useMapActions } from '../../../context/MapActions';
import { Tag } from '../Tag';
import type { AcaoStatusModelTypes } from '../../../types/AcaoStatus';
import { useFilters } from '../../../context/FiltersContext';
import { Button } from '@/components/Buttons/BaseButton';
import { IconProgressX } from '@tabler/icons-react';
import { FilesCarrrousel } from '@/components/FilesCarrousel';
import { IoIosAdd } from 'react-icons/io';
import { ScrollArea } from '@/components/ui/scroll-area';

export function AcaoDetails() {
  const { acoes, denuncias } = useOcorrencias();
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
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0">
        <BackButton to="/ocorrencias/acoes" children="Detalhes da Ação" />
        <div className="flex justify-between items-center mt-4">
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

      <div className="flex-1 flex flex-col gap-4 mt-6 pr-2 ">
        {denunciasVinculadas.length > 0 && (
          <div className="flex items-center p-3 bg-blue-50 rounded-xl border border-blue-200">
            <FaInfoCircle className="text-blue-500 mr-3 flex-shrink-0" />
            <p className="text-sm font-semibold text-blue-800">
              Esta ação possui uma área de cobertura (polígono) no mapa.
            </p>
          </div>
        )}

        <div className="rounded-xl max-h-80 space-y-3 border p-3 mb-5">
          <div className="flex justify-between items-center">
            <h1 className="font-semibold text-md text-gray-800">
              Denúncias Vinculadas
            </h1>
            <button
              onClick={() => navigate('vincular-denuncias')}
              className=" bg-blue-500 rounded-full p-1"
            >
              {currentAcaoStatus !== 'indeferido' && (
                <IoIosAdd size={24} color="white" />
              )}
            </button>
          </div>

          {currentAcaoStatus !== 'indeferido' ? (
            denunciasVinculadas.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">Nenhuma denúncia vinculada.</p>
              </div>
            ) : (
              <ScrollArea className="h-96 w-full p-2">
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
                "
              </ScrollArea>
            )
          ) : (
            <div className="text-center py-10">
              <p className="text-red-600 font-semibold">
                Esta ação foi indeferida.
              </p>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-800 mb-2">Mídias:</h3>
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

      <footer className="flex flex-col gap-2 pt-4 border-t border-gray-200 flex-shrink-0">
        {['em_analise', 'em_andamento'].includes(currentAcaoStatus) && (
          <div className="flex justify-end">
            <Button
              variant="outline_danger"
              size="sm"
              onClick={() => navigate('indeferir')}
              className=""
            >
              <IconProgressX className="inline h-4" />
              Indeferir Ação
            </Button>
          </div>
        )}
      </footer>
    </div>
  );
}
