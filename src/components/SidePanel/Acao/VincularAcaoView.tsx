import { useState, type FC } from 'react';
import { useVincularDenunciaContext } from '../../../context/vincularDenunciaContext';
import { useOcorrenciasContext } from '../../../context/OcorrenciasContext';
import type { Acao } from '../../../types/Acao';
import { ConfirmModal } from '../../Modals/ConfirmModal';
import { BackButton } from '../../Buttons/Backbutton';
import { FaMapPin } from 'react-icons/fa';

export const VincularAcaoView: FC = () => {
  const { acoes, setActualDetailItem } = useOcorrenciasContext();
  const [isOpen, setIsOpen] = useState(false);
  const [currentAcao, setCurrentAcao] = useState<Acao | null>(null);
  const {
    denunciaParaVincular,
    confirmLink,
    cancelLinking,
    acaoParaVincular,
    setAcaoParaVincular,
    setIsSelectingAcaoInMap,
    isSelectingAcaoInMap,
  } = useVincularDenunciaContext();

  if (!denunciaParaVincular) return null;

  function handleOnConfirmLink(acao: Acao) {
    confirmLink(acao.id);
    setActualDetailItem(acaoParaVincular);
    setAcaoParaVincular(null);
  }

  function handleOnSelectAcao(acao: Acao) {
    setIsOpen(true);
    setCurrentAcao(acao);
  }

  return (
    <>
      <div className="flex flex-col h-full">
        <BackButton onClick={cancelLinking} />
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">Vinculando denúncia:</p>
          <p className="font-bold text-blue-900">
            {denunciaParaVincular.tipo.name}
          </p>
          <p className="flex text-xs text-blue-800 mt-1">
            <span className="mr-1">
              <FaMapPin />
            </span>
            {`${denunciaParaVincular.endereco.rua}, ${denunciaParaVincular.endereco.bairro}`}
          </p>
        </div>
        <button
          onClick={() => setIsSelectingAcaoInMap((current) => !current)}
          className={`w-full ${
            isSelectingAcaoInMap
              ? ' border-2 border-red-600 bg-red-600 hover:bg-red-700 text-white'
              : ' border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
          } text-sm font-semibold py-2 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed mb-2`}
        >
          {!isSelectingAcaoInMap
            ? 'Selecionar Ação no Mapa'
            : 'Cancelar seleção no mapa'}
        </button>
        {acaoParaVincular && (
          <div className="my-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">Ação selecionada:</p>
            <p className="font-bold text-blue-900">{acaoParaVincular.nome}</p>
            <p className="text-sm text-blue-800 font-semibold">
              {acaoParaVincular.secretaria.name}
            </p>
          </div>
        )}

        <h3 className="font-semibold text-gray-800 mb-2">
          Selecione uma Ação Existente:
        </h3>
        <div className="flex-1 rounded-lg overflow-y-auto bg-gray-50 space-y-2 p-2">
          {acoes.map((acao) => (
            <button
              key={acao.id}
              onClick={() => setAcaoParaVincular(acao)}
              className="w-full text-left p-3 bg-white rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
            >
              <p className="font-semibold text-gray-700">{acao.nome}</p>
              <p className="text-xs font-semibold text-gray-300">
                {acao.secretaria.name}
              </p>
            </button>
          ))}
        </div>
        {acaoParaVincular && (
          <button
            className="w-full bg-bg-blue-600 bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
            onClick={() => handleOnSelectAcao(acaoParaVincular!)}
          >
            Confirmar vínculo
          </button>
        )}
      </div>

      <ConfirmModal
        isOpen={isOpen}
        title="Vínculo de denúncia à ação"
        message={`Você deseja vincular essa denúncia ${denunciaParaVincular.tipo} à essa ação ${currentAcao?.nome}?`}
        onCancel={cancelLinking}
        onConfirm={() => handleOnConfirmLink(acaoParaVincular!)}
      />
    </>
  );
};
