import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { useOcorrenciasContext } from '../../../context/OcorrenciasContext';
import { DenunciaManageInAction } from '../Denuncia/DenunciaManagerInAction';
import { Tag } from '../Tag';
import { BackButton } from '../../Buttons/Backbutton';

export function AcaoDetails() {
  const { acoes, denuncias } = useOcorrenciasContext();

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
    return denuncias.filter((d) => d.acaoId == acao.id);
  }, [denuncias]);

  // async function handleRemoveDenuncia() {
  //   try {
  //     setAcoes((acoes) => {
  //       const current = acoes.find((acao) => acao.id === item.id);
  //       if (!current) return acoes;

  //       const newPolygonCoords = current.polygonCoords.filter(
  //         (coord) =>
  //           !(
  //             coord[0] === currentDenuncia?.endereco.latitude &&
  //             coord[1] === currentDenuncia?.endereco.longitude
  //           ),
  //       );

  //       const newActionCoordinates = getPolygonoCenter(newPolygonCoords);

  //       return acoes.map((a) => {
  //         if (a.id === item.id) {
  //           return {
  //             ...a,
  //             lat: newActionCoordinates[0],
  //             lon: newActionCoordinates[1],
  //             polygonCoords: newPolygonCoords,
  //           };
  //         }
  //         return a;
  //       });
  //     });

  //     setDenuncias((current) =>
  //       current.map((d) => {
  //         if (d.id === currentDenuncia?.id) {
  //           return {
  //             ...d,
  //             status: 'aberto',
  //             acaoId: null,
  //           };
  //         }
  //         return d;
  //       }),
  //     );

  //     setIsOpenRemoveDenunciaConfirmationModal(false);
  //     toast('Denúncia removida com sucesso desta ação!', { type: 'success' });
  //     setCurrentDenuncia(null);
  //   } catch (error) {
  //     console.error('Falha ao remover denúncia:', error);
  //     toast('Erro ao remover denúncia.', { type: 'error' });
  //   }
  // }

  // async function handleIndeferirAcao(reason: string) {
  //   try {
  //     setActualDetailItem((current) => ({
  //       ...current!,
  //       status: 'indeferido',
  //     }));

  //     setDenuncias((current) =>
  //       current.map((d) => {
  //         if (d.acaoId === item.id) {
  //           return { ...d, acaoId: null, status: 'aberto' };
  //         }
  //         return d;
  //       }),
  //     );

  //     setAcoes((current) =>
  //       current.map((a) => {
  //         if (a.id === item.id) {
  //           return { ...a, status: 'indeferido', polygonCoords: [] };
  //         }
  //         return a;
  //       }),
  //     );

  //     setPrevAction(null);
  //     setShowIndeferirAcaoMotivo(false);
  //     toast('Ação indeferida com sucesso!', { type: 'success' });
  //   } catch (error) {
  //     console.error('Falha ao indeferir ação:', error);
  //     toast('Erro ao indeferir ação.', { type: 'error' });
  //   }
  // }

  return (
    <>
      <div className="flex flex-col gap-4">
        <BackButton to="/ocorrencias/acoes" children="Detalhes da Ação" />

        <div className="flex justify-between items-center pb-4">
          <h1>{acao.nome}</h1>
          <Tag status={acao.status} />
        </div>

        {denunciasVinculadas.length > 0 && (
          <div className="flex items-center p-3 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm font-semibold text-blue-800">
              Esta ação possui uma área de cobertura (polígono) no mapa.
            </p>
          </div>
        )}

        {acao.status == 'indeferido' && (
          <div>
            <p>Essa ação foi indeferida</p>
          </div>
        )}

        <div className="rounded-lg max-h-80 space-y-3 p-2">
          {acao.status != 'indeferido' &&
            (denunciasVinculadas.length === 0 ? (
              <p>Essa ação não possui nenhuma denúncia vinculada</p>
            ) : (
              denunciasVinculadas.map((denuncia) => (
                <DenunciaManageInAction key={denuncia.id} denuncia={denuncia} />
              ))
            ))}
        </div>

        <button className="w-full cursor-pointer font-bold py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          Vincular denúncia
        </button>

        {['aberto', 'em_andamento'].includes(acao.status) && (
          <button
            onClick={() => navigate('indeferir')}
            className="w-full cursor-pointer font-bold py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Indeferir ação
          </button>
        )}
      </div>
    </>
  );
}
