import type { Denuncia } from '../../../types/Denuncia';
import type { FC } from 'react';
import { Tag } from './../Tag';
import { ImageModal } from '../../Modals/ImageModal';
import { useState } from 'react';
import { useVincularDenunciaContext } from '../../../context/vincularDenunciaContext';
import { useIndeferirDenunciaContext } from '../../../context/IndeferirDenunciaContext';
import { useOcorrenciasContext } from '../../../context/ocorrenciasContext';
import { ConfirmModal } from '../../Modals/ConfirmModal';
import { FaTrashAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface DenunciaDetailsViewProps {
  item: Denuncia;
}

export const DenunciaDetails: FC<DenunciaDetailsViewProps> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { startIndeferir } = useIndeferirDenunciaContext();
  const [currentDenuncia, setCurrentDenuncia] = useState<Denuncia | null>(null);
  const { startLinking } = useVincularDenunciaContext();
  const { setDenuncias, setActualDetailItem, acoes } = useOcorrenciasContext();
  const [imagemEmDestaque, setImagemEmDestaque] = useState<string | null>(null);
  const acaoVinculada = acoes.filter((a) => a.id === item.acaoId);

  async function handleConfirmDesvincularDenunciaAcao() {
    try {
      setActualDetailItem((current) => ({
        ...current!,
        status: 'aberto',
        acaoId: null,
      }));
      setDenuncias((current) =>
        current.map((d) => {
          if (d.id == currentDenuncia?.id) {
            return {
              ...d,
              status: 'aberto',
              acaoId: null,
            };
          }
          return d;
        }),
      );
      setIsOpen(false);
      toast('Denuncia removida com sucesso dessa ação!', {
        type: 'success',
      });
      setCurrentDenuncia(null);
    } catch {
      // Lidar com o erro, se necessário
    }
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex-row">
            {/* ✅ Melhor de 'refactor/filter': Acessa o nome do objeto */}
            <p className="text-sm font-semibold text-yellow-700">
              {item.categoria}
            </p>
            <h2 className="text-xl font-bold text-gray-800 flex-1">
              {item.tipo}
            </h2>
            <p className="text-sm text-gray-500">
              Registrado em:{' '}
              {new Date(item.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
          {/* ✅ Melhor de 'main': Componente Tag para status */}
          <Tag status={item.status} />
        </div>

        <div>
          <h3 className="font-semibold text-sm text-gray-800 mb-1 ">
            Descrição:
          </h3>
          <p className="text-sm text-gray-600">{item.descricao}</p>
        </div>

        <div className="flex-col text-gray-700 border border-gray-200 p-4 rounded-2xl">
          <h3 className="font-semibold text-gray-800 text-sm mb-1">
            Endereço:
          </h3>
          <p className="text-sm text-gray-600">
            {item.endereco.rua}, {item.endereco.bairro}
          </p>
          <p className="text-sm text-gray-600">
            {item.endereco.ponto_referencia}
          </p>
          <p className="text-sm text-gray-600">CEP: {item.endereco.cep}</p>
          <div className="flex mt-2">
            <p className="text-sm font-bold text-blue-900 py-1 px-4 bg-blue-100 mr-2 rounded-sm">
              {item.endereco.latitude}
            </p>
            <p className="text-sm font-bold text-blue-900 py-1 px-4 bg-blue-100 mr-2 rounded-sm">
              {item.endereco.longitude}
            </p>
          </div>
        </div>

        {/* ✅ Melhor de 'main': UI mais detalhada e segura (com modal) */}
        {item.acaoId ? (
          <>
            <div className="flex items-center px-4 py-3 justify-between bg-yellow-100 rounded-xl">
              <div>
                <p className="text-sm font-semibold text-yellow-600">
                  Ação Vinculada:
                </p>
                <p className="text-md font-semibold text-yellow-800">
                  {acaoVinculada.length > 0
                    ? acaoVinculada[0].nome ?? acaoVinculada[0].id
                    : 'Desconhecida'}
                </p>
                <p className="text-xs font-semibold text-yellow-700">
                  {acaoVinculada.length > 0
                    ? acaoVinculada[0].secretaria.name ?? ''
                    : 'Desconhecida'}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(true)}
                className="z-10 cursor-pointer rounded-full p-2 text-yellow-800 transition-colors hover:bg-red-100 hover:text-red-600"
              >
                <FaTrashAlt />
              </button>
            </div>
          </>
        ) : (
          <div className=" py-3 px-4 rounded-xl border border-gray-200">
            <p className="text-sm font-semibold text-gray-800">
              Nenhuma ação vinculada
            </p>
            <div className="py-2">
              <button
                onClick={() => startLinking(item)}
                className="w-full bg-blue-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Vincular a uma Ação
              </button>
            </div>
          </div>
        )}

        {item.images.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Imagens:</h3>
            <div className="grid grid-flow-col auto-cols-[10rem] gap-x-2 overflow-x-auto pb-2 pt-2 custom-scrollbar-blue">
              {item.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() =>
                    setImagemEmDestaque(
                      `http://localhost:3000/files/uploads/${img.name}`,
                    )
                  }
                  className="relative"
                >
                  <img
                    src={`http://localhost:3000/files/uploads/${img.name}`}
                    alt={img.name}
                    className="h-40 w-full object-cover rounded-lg hover:opacity-80 transition-opacity"
                  />
                </button>
              ))}
              <ImageModal
                imageUrl={imagemEmDestaque}
                onClose={() => setImagemEmDestaque(null)}
              />
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
            onClick={() => startIndeferir(item)}
            className="w-full border-2 text-sm border-red-500 text-red-500 font-semibold py-2 rounded-lg transition-colors hover:bg-red-500 hover:text-white"
          >
            Indeferir Denúncia
          </button>
        )}
      </div>

      <ConfirmModal
        isOpen={isOpen}
        title={'Confirmação de Desvinculo'}
        message={`Você tem certeza que deseja desvincular a denúncia "${item.titulo}" da ação:"${item.acaoId}"?`}
        onCancel={() => setIsOpen(false)}
        onConfirm={handleConfirmDesvincularDenunciaAcao}
      />
    </>
  );
};
