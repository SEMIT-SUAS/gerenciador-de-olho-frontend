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

export function AcaoDetails() {
  const { acoes, denuncias } = useOcorrencias();
  const { setZoomTo } = useMapActions();
  const {
    cacheCurrentFilters,
    restoreCachedFilters,
    setFiltroDenunciasComAcao,
    setFiltroStatusDenuncia,
  } = useFilters();

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
    setFiltroDenunciasComAcao('com_acao');

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
    <div className="flex flex-col h-full p-4">
      <div className="flex-shrink-0">
        <BackButton to="/ocorrencias/acoes" />
        <div className="flex justify-between items-center mt-4">
          <h1 className="text-2xl font-bold text-gray-800">{acao.nome}</h1>
          <Tag status={currentAcaoStatus} />
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4 mt-6 overflow-y-auto pr-2">
        {denunciasVinculadas.length > 0 && (
          <div className="flex items-center p-3 bg-blue-50 rounded-xl border border-blue-200">
            <FaInfoCircle className="text-blue-500 mr-3 flex-shrink-0" />
            <p className="text-sm font-semibold text-blue-800">
              Esta ação possui uma área de cobertura (polígono) no mapa.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {currentAcaoStatus !== 'indeferido' ? (
            denunciasVinculadas.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">Nenhuma denúncia vinculada.</p>
              </div>
            ) : (
              denunciasVinculadas.map((denuncia) => {
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
              })
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

      <footer className="flex flex-col gap-2 pt-4 border-t border-gray-200 flex-shrink-0">
        {currentAcaoStatus !== 'indeferido' && (
          <button
            onClick={() => navigate('vincular-denuncias')}
            className="w-full cursor-pointer font-bold py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Vincular denúncia
          </button>
        )}

        {['em_analise', 'em_andamento'].includes(currentAcaoStatus) && (
          <button
            onClick={() => navigate('indeferir')}
            className="w-full cursor-pointer font-bold py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Indeferir ação
          </button>
        )}
      </footer>
    </div>
  );
}
