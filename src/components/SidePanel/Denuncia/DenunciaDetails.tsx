import type { Denuncia } from '../../../types/Denuncia';
import type { FC } from 'react';
import { Tag } from './../Tag';
import { ImageModal } from '../../Modals/ImageModal';
import { useEffect, useMemo, useState } from 'react';
import { useVincularDenunciaContext } from '../../../context/vincularDenunciaContext';
import { useOcorrenciasContext } from '../../../context/OcorrenciasContext';
import { ConfirmModal } from '../../Modals/ConfirmModal';
import { FaTrashAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { IndeferiItemForm } from '../../Forms/IndeferirItemForm';
import { denunciasSuggestions } from '../../../constants/messagesRejectComplaint';
import { API_BASE_URL } from '../../../config/api';

interface DenunciaDetailsViewProps {
  item: Denuncia;
}

export const DenunciaDetails: FC<DenunciaDetailsViewProps> = ({ item }) => {
  const [isDesvincularModalOpen, setIsDesvincularModalOpen] = useState(false);
  const { startLinking } = useVincularDenunciaContext();
  const {
    setDenuncias,
    setActualDetailItem,
    acoes,
    prevAction,
    setPrevAction,
    actualDetailItem,
  } = useOcorrenciasContext();
  const [imagemEmDestaque, setImagemEmDestaque] = useState<string | null>(null);
  const [showIndeferirDenuncia, setShowIndeferirDenuncia] = useState(false);

  useEffect(() => {
    if (!prevAction) {
      setShowIndeferirDenuncia(false);
    }
  }, [prevAction]);

  const acaoVinculada = useMemo(() => {
    return acoes.find((a) => a.id === item.acaoId);
  }, acoes);

  async function handleConfirmDesvincularDenunciaAcao() {
    try {
      setActualDetailItem((current) => ({
        ...current!,
        status: 'aberto',
        acaoId: null,
      }));
      setDenuncias((current) =>
        current.map((d) => {
          if (d.id === item.id) {
            return {
              ...d,
              status: 'aberto',
              acaoId: null,
            };
          }
          return d;
        }),
      );
      setIsDesvincularModalOpen(false);
      toast('Denúncia desvinculada com sucesso!', { type: 'success' });
    } catch (error) {
      toast.error('Erro ao desvincular denúncia.');
      console.error(error);
    }
  }

  function handleIndeferirDenuncia(reason: string) {
    try {
      const updatedDenuncia: Denuncia = {
        ...item,
        status: 'indeferido',
        motivoStatus: reason,
      };

      setDenuncias((current) =>
        current.map((d) => (d.id === item.id ? updatedDenuncia : d)),
      );

      setPrevAction(null);
      setActualDetailItem(updatedDenuncia);
      setShowIndeferirDenuncia(false);
      toast.success('Denúncia indeferida com sucesso!');
    } catch (error) {
      toast.error('Erro ao indeferir denúncia.');
      console.error(error);
    }
  }

  return (
    <>
      <div className="space-y-4">
        {showIndeferirDenuncia ? (
          <IndeferiItemForm
            title={item.tipo.name}
            description={`${item.endereco.rua}, ${item.endereco.bairro}`}
            messages={denunciasSuggestions}
            onSubmit={handleIndeferirDenuncia}
          />
        ) : (
          <>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-yellow-700">
                  {item.categoria.name}
                </p>
                <h2 className="text-xl font-bold text-gray-800">
                  {item.tipo.name}
                </h2>
                <p className="text-sm text-gray-500">
                  Registrado em:{' '}
                  {new Date(item.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <Tag status={item.status} />
            </div>

            <div>
              <h3 className="font-semibold text-sm text-gray-800 mb-1">
                Descrição:
              </h3>
              <p className="text-sm text-gray-600">{item.descricao}</p>
            </div>

            <div className="flex-col text-gray-700 border border-gray-200 p-4 rounded-2xl space-y-2">
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">
                  Endereço:
                </h3>
                <p className="text-sm text-gray-600">
                  {item.endereco.rua}, {item.endereco.bairro} (CEP:{' '}
                  {item.endereco.cep})
                </p>
                <p className="text-sm text-gray-600">
                  {item.endereco.ponto_referencia}
                </p>
              </div>
            </div>

            {acaoVinculada && (
              <div className="flex items-center px-4 py-3 justify-between bg-yellow-50 border border-yellow-200 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-yellow-700">
                    Ação Vinculada:
                  </p>
                  <p className="text-md font-bold text-yellow-900">
                    {acaoVinculada.nome}
                  </p>
                  <p className="text-xs font-semibold text-yellow-800">
                    {acaoVinculada.secretaria.name}
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

            {!acaoVinculada &&
              !['indeferido', 'concluido'].includes(item.status) && (
                <div className="py-3 px-4 rounded-xl border border-gray-200 text-center space-y-2">
                  <p className="text-sm font-semibold text-gray-800">
                    Nenhuma ação vinculada
                  </p>
                  <button
                    onClick={() => startLinking(item)}
                    className="w-full bg-blue-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Vincular a uma Ação
                  </button>
                </div>
              )}

            {item.images.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Imagens:</h3>
                <div className="grid grid-flow-col auto-cols-auto gap-x-3 overflow-x-auto pb-2">
                  {item.images.map((img) => {
                    return (
                      <button
                        key={img.id}
                        onClick={() =>
                          setImagemEmDestaque(
                            `${API_BASE_URL}/files/uploads/${img.name}`,
                          )
                        }
                        className="relative h-40 w-40 flex-shrink-0"
                      >
                        <img
                          src={`${API_BASE_URL}/files/uploads/${img.name}`}
                          alt={img.name}
                          className="h-full w-full object-cover rounded-lg hover:opacity-80 transition-opacity"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {item.status === 'indeferido' && item.motivoStatus && (
              <div className="p-3 bg-red-50 border-l-4 border-red-400 text-red-700">
                <p className="font-bold">Motivo do Indeferimento:</p>
                <p>{item.motivoStatus}</p>
              </div>
            )}

            {item.status === 'aberto' && (
              <button
                onClick={() => {
                  setPrevAction(item);
                  setShowIndeferirDenuncia(true);
                }}
                className="w-full border-2 text-sm border-red-500 text-red-500 font-semibold py-2 rounded-lg transition-colors hover:bg-red-500 hover:text-white"
              >
                Indeferir Denúncia
              </button>
            )}
          </>
        )}
      </div>

      <ImageModal
        imageUrl={imagemEmDestaque}
        onClose={() => setImagemEmDestaque(null)}
      />

      <ConfirmModal
        isOpen={isDesvincularModalOpen}
        title={'Confirmar Desvinculo'}
        message={`Deseja desvincular a denúncia "${item.tipo.name}" da ação "${acaoVinculada?.nome}"?`}
        onCancel={() => setIsDesvincularModalOpen(false)}
        onConfirm={handleConfirmDesvincularDenunciaAcao}
      />
    </>
  );
};
