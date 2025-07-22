import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { useOcorrencias } from '../../../context/OcorrenciasContext';
import { DenunciaManageInAction } from '../Denuncia/DenunciaManagerInAction';
import { Tag } from '../Tag';
import { BackButton } from '../../Buttons/Backbutton';
import { FaInfoCircle } from 'react-icons/fa';
import { useMapActions } from '../../../context/MapActions';

export function AcaoDetails() {
  const { acoes, denuncias } = useOcorrencias();
  const { setZoomTo } = useMapActions();

  const params = useParams();
  const acaoId = params.acaoId;
  const navigate = useNavigate();

  const acao = useMemo(() => {
    return acoes.find((ac) => ac.id == Number(acaoId));
  }, [acaoId, acoes]);

  if (!acao) {
    return <Navigate to="/404" replace />;
  }

  const denunciasVinculadas = useMemo(() => {
    return denuncias.filter((d) => d.acao?.id == acao.id);
  }, [denuncias]);

  useEffect(() => {
    setZoomTo({
      lat: acao.latitude,
      lng: acao.longitude,
    });

    return () => setZoomTo(null);
  }, [acao, acaoId]);

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex-shrink-0">
        <BackButton to="/ocorrencias/acoes" />
        <div className="flex justify-between items-center mt-4">
          <h1 className="text-2xl font-bold text-gray-800">{acao.nome}</h1>
          <Tag status={acao.status} />
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
          {acao.status[0].status !== 'indeferido' &&
            (denunciasVinculadas.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">Nenhuma denúncia vinculada.</p>
              </div>
            ) : (
              denunciasVinculadas.map((denuncia) => (
                <DenunciaManageInAction
                  key={denuncia.id}
                  denuncia={denuncia}
                  allowDisvincularItem={
                    denunciasVinculadas.length > 1 &&
                    ['aberto', 'em_andamento'].includes(acao.status[0].status)
                  }
                />
              ))
            ))}
        </div>
      </div>

      <footer className="flex flex-col gap-2 pt-4 border-t border-gray-200 flex-shrink-0">
        <button
          onClick={() => navigate('vincular-denuncias')}
          className="w-full cursor-pointer font-bold py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Vincular denúncia
        </button>

        {['aberto', 'em_andamento'].includes(acao.status) && (
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
