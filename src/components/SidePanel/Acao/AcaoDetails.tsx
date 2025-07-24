import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { useOcorrenciasContext } from '../../../context/OcorrenciasContext';
import { DenunciaManageInAction } from '../Denuncia/DenunciaManagerInAction';
import { Tag } from '../Tag';
import { BackButton } from '../../Buttons/Backbutton';
import { Button } from '../../Buttons/Button';
import { AddButton } from '@/components/Buttons/AddButton';
import { IoIosAdd } from 'react-icons/io';
import { FilesCarrrousel } from '@/components/FilesCarrousel';

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

        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">
                Responsável: {acao.secretaria}
            </p>
            <h1 className='text-xl font-bold text-gray-800 mr-2'>{acao.nome}</h1>
          </div>
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
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Imagens:</h3>
          <FilesCarrrousel
            files={denunciasVinculadas.flatMap((denuncia) =>
              denuncia.images.map((file) => ({
                id: file.id,
                name: file.name,
                type: file.name.includes('.mp4') ? 'video' : 'image',
              }))
            )}
          />
        </div>

        <div className="rounded-xl max-h-80 space-y-3 border p-4">
          <div className='flex justify-between items-center'>
            <h1 className='font-semibold text-md text-gray-800'>
              Denúncias Vinculadas
            </h1>
            <button className=' bg-blue-500 rounded-full p-1'>
              <IoIosAdd size={24} color='white'/>
            </button>
          </div>
          {acao.status != 'indeferido' &&
            (denunciasVinculadas.length === 0 ? (
              <p>Essa ação não possui nenhuma denúncia vinculada</p>
            ) : (
              denunciasVinculadas.map((denuncia) => (
                <DenunciaManageInAction key={denuncia.id} denuncia={denuncia} />
              ))
            ))}
        </div>

        <div className='gap-2 flex flex-col'>
            {['aberto', 'em_andamento'].includes(acao.status) && (
              <Button
              variant='outline_danger' size='sm'
                onClick={() => navigate('indeferir')}
                className="w-full"
              >
                Indeferir ação
              </Button>
            )}
        </div>

      </div>
    </>
  );
}
