import { useEffect, useMemo, useState, type FC } from 'react';
import type { Acao } from '../../../types/Acao';
import type { Denuncia } from '../../../types/Denuncia';
import { Tag } from '../Tag';
import { FaTrashAlt } from 'react-icons/fa';
import { ConfirmModal } from '../../Modals/ConfirmModal';
import { useOcorrenciasContext } from '../../../context/OcorrenciasContext';
import { toast } from 'react-toastify';
import { getPolygonoCenter } from '../../../utils/geometry';
import { IndeferiItemForm } from '../../Forms/IndeferirItemForm';
import { actionsSuggestions } from '../../../constants/messagesRejectComplaint';

interface AcaoDetailsProps {
  item: Acao;
}

export const AcaoDetails: FC<AcaoDetailsProps> = ({ item }) => {
  const {
    setDenuncias,
    setAcoes,
    denuncias,
    setActualDetailItem,
    prevAction,
    setPrevAction,
  } = useOcorrenciasContext();

  const [currentDenuncia, setCurrentDenuncia] = useState<Denuncia | null>(null);
  const [
    isOpenRemoveDenunciaConfirmationModal,
    setIsOpenRemoveDenunciaConfirmationModal,
  ] = useState(false);
  const [showIndeferirAcaoMotivo, setShowIndeferirAcaoMotivo] = useState(false);

  const denunciasVinculadas = useMemo(() => {
    return denuncias.filter((d) => d.acaoId === item.id);
  }, [denuncias]);

  useEffect(() => {
    if (!prevAction) {
      setShowIndeferirAcaoMotivo(false);
    }
  }, [prevAction]);

  async function handleRemoveDenuncia() {
    try {
      setAcoes((acoes) => {
        const current = acoes.find((acao) => acao.id === item.id);
        if (!current) return acoes;

        const newPolygonCoords = current.polygonCoords.filter(
          (coord) =>
            !(
              coord[0] === currentDenuncia?.endereco.latitude &&
              coord[1] === currentDenuncia?.endereco.longitude
            ),
        );

        const newActionCoordinates = getPolygonoCenter(newPolygonCoords);

        return acoes.map((a) => {
          if (a.id === item.id) {
            return {
              ...a,
              lat: newActionCoordinates[0],
              lon: newActionCoordinates[1],
              polygonCoords: newPolygonCoords,
            };
          }
          return a;
        });
      });

      setDenuncias((current) =>
        current.map((d) => {
          if (d.id === currentDenuncia?.id) {
            return {
              ...d,
              status: 'aberto',
              acaoId: null,
            };
          }
          return d;
        }),
      );

      setIsOpenRemoveDenunciaConfirmationModal(false);
      toast('Denúncia removida com sucesso desta ação!', { type: 'success' });
      setCurrentDenuncia(null);
    } catch (error) {
      console.error('Falha ao remover denúncia:', error);
      toast('Erro ao remover denúncia.', { type: 'error' });
    }
  }

  async function handleIndeferirAcao(reason: string) {
    try {
      setActualDetailItem((current) => ({
        ...current!,
        status: 'indeferido',
      }));

      setDenuncias((current) =>
        current.map((d) => {
          if (d.acaoId === item.id) {
            return { ...d, acaoId: null, status: 'aberto' };
          }
          return d;
        }),
      );

      setAcoes((current) =>
        current.map((a) => {
          if (a.id === item.id) {
            return { ...a, status: 'indeferido', polygonCoords: [] };
          }
          return a;
        }),
      );

      setPrevAction(null);
      setShowIndeferirAcaoMotivo(false);
      toast('Ação indeferida com sucesso!', { type: 'success' });
    } catch (error) {
      console.error('Falha ao indeferir ação:', error);
      toast('Erro ao indeferir ação.', { type: 'error' });
    }
  }

  return (
    <>
      <div className="flex flex-col space-y-4">
        {!showIndeferirAcaoMotivo && (
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800">{item.nome}</h2>
              <p className="text-sm text-gray-500">
                Responsável: {item.secretaria.name}
              </p>
            </div>
            <Tag status={item.status} />
          </div>
        )}

        {showIndeferirAcaoMotivo ? (
          <IndeferiItemForm
            onSubmit={handleIndeferirAcao}
            title={item.nome}
            description={item.secretaria.name}
            messages={actionsSuggestions}
          />
        ) : (
          <>
            {item.polygonCoords.length > 0 && item.status !== 'indeferido' && (
              <div className="flex items-center p-3 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm font-semibold text-blue-800">
                  Esta ação possui uma área de cobertura (polígono) no mapa.
                </p>
              </div>
            )}

            {item.status !== 'indeferido' && (
              <div>
                <h3 className="font-semibold text-sm text-gray-800 mb-1">
                  Denúncias Vinculadas ({denunciasVinculadas.length}):
                </h3>
                <div className="rounded-lg max-h-80 space-y-3 p-2">
                  {denunciasVinculadas.length > 0 ? (
                    denunciasVinculadas.map((d) => (
                      <div
                        key={d.id}
                        onClick={() => {
                          setPrevAction(item);
                          setActualDetailItem(d);
                        }}
                        aria-label={`Ver detalhes da denúncia ${d.tipo.name}`}
                        className="group flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-left shadow-sm transition-all hover:shadow-md focus:outline-none cursor-pointer"
                      >
                        <div className="flex flex-col">
                          <p className="font-semibold text-gray-800">
                            {d.tipo.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {d.endereco.rua}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Tag status={d.status} />
                          {item.status !== 'concluido' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentDenuncia(d);
                                setIsOpenRemoveDenunciaConfirmationModal(true);
                              }}
                              aria-label={`Desvincular denúncia ${d.tipo.name}`}
                              className="z-10 cursor-pointer rounded-full p-2 text-gray-400 transition-colors hover:bg-red-100 hover:text-red-600"
                            >
                              <FaTrashAlt />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                      <p className="text-sm text-gray-500">
                        Nenhuma denúncia vinculada.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {['aberto', 'em_andamento'].includes(item.status) && (
              <button
                onClick={() => {
                  setPrevAction(item);
                  setShowIndeferirAcaoMotivo(true);
                }}
                className="w-full cursor-pointer font-bold py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Indeferir ação
              </button>
            )}
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={isOpenRemoveDenunciaConfirmationModal}
        title="Desvincular denúncia"
        message="Você realmente deseja desvincular essa denúncia dessa ação?"
        onConfirm={handleRemoveDenuncia}
        onCancel={() => {
          setCurrentDenuncia(null);
          setIsOpenRemoveDenunciaConfirmationModal(false);
        }}
      />
    </>
  );
};
