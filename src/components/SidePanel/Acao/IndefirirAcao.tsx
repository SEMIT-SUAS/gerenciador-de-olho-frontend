import { BackButton } from '@/components/Buttons/Backbutton';
import { ConfirmModal } from '@/components/Modals/ConfirmModal';
import { mensagensSugeridasParaIndeferirAcao } from '@/constants/messagesRejectComplaint';
import { useOcorrencias } from '@/context/OcorrenciasContext';
import { useMemo, useState } from 'react';
import { FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { Navigate, useParams } from 'react-router-dom';

export function IndeferirAcao() {
  const [isOpenIndeferirModal, setIsOpenIndeferirModal] = useState(false);
  const [motivo, setMotivo] = useState('');

  const { acoes } = useOcorrencias();

  const acaoId = useParams().acaoId;

  const acao = useMemo(() => {
    return acoes.find((ac) => ac.id === Number(acaoId));
  }, [acoes, acaoId]);

  const acaoStatus = useMemo(() => {
    if (!acao) return null;

    return acao.status[0].status;
  }, [acao, acaoId]);

  if (
    !acao ||
    !acaoStatus ||
    !['em_analise', 'em_andamento'].includes(acaoStatus)
  ) {
    return <Navigate to="/404" />;
  }

  return (
    <>
      <div className="flex flex-col gap-2 h-full p-4 bg-white">
        <BackButton children="Indeferir Ação" />
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-red-500 text-xl mr-3" />
            <div>
              <p className="text-sm font-semibold text-red-800">
                Você está indeferindo o item:
              </p>
              <p className="font-bold text-red-900 text-lg">{acao.nome}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col space-y-6 overflow-y-auto pr-2">
          <div>
            <label
              htmlFor="motivo-indeferimento"
              className="block font-semibold text-slate-800 mb-2"
            >
              Motivo do Indeferimento
            </label>
            <div className="relative">
              <textarea
                id="motivo-indeferimento"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                rows={6}
                maxLength={500}
                className="w-full resize-none border-slate-300 rounded-md shadow-sm p-3 text-slate-700 text-sm
                           focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                placeholder="Descreva claramente o motivo para o indeferimento..."
              />
              <span className="absolute bottom-2 right-3 text-xs text-slate-400">
                {motivo.length} / 500
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-slate-800 font-semibold mb-3">
              Ou selecione uma mensagem rápida
            </h4>
            <div className="flex flex-wrap gap-2">
              {mensagensSugeridasParaIndeferirAcao.map((message) => (
                <button
                  key={message}
                  onClick={() => setMotivo(message)}
                  className="px-4 py-2 text-xs text-start border border-slate-300 rounded-full text-slate-700 
                             font-medium hover:bg-red-50 hover:border-red-400 hover:text-red-700 
                             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
                >
                  {message}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsOpenIndeferirModal(true)}
          disabled={!motivo.trim()}
          className="flex items-center justify-center w-full max-w-xs bg-red-600 text-white font-bold py-3 rounded-lg transition-colors
                           hover:bg-red-700
                           disabled:bg-red-300 disabled:cursor-not-allowed"
        >
          <FaCheck className="mr-2" />
          Confirmar Indeferimento
        </button>
      </div>

      <ConfirmModal
        isOpen={isOpenIndeferirModal}
        title="Indeferir Ação"
        message="Você realmente quer indeferir essa denúncia? Ação irreversível"
        onCancel={() => setIsOpenIndeferirModal(false)}
        onConfirm={() => null}
      />
    </>
  );
}
