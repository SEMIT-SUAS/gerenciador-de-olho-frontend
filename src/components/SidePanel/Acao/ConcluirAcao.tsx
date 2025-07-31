import { BackButton } from '@/components/Buttons/Backbutton';
import { ConfirmModal } from '@/components/Modals/ConfirmModal';
import { useOcorrencias } from '@/context/OcorrenciasContext';
import { useMemo, useState, useEffect } from 'react';
import { FaCheck } from 'react-icons/fa';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { mensagensSugeridasParaConcluirAcao } from '@/constants/MensagensConcluirAcao';
import type { AcaoStatusModel } from '@/types/AcaoStatus';
import { userMock } from '@/constants/mocks';
import type { AcaoModel } from '@/types/Acao';
import { toast } from 'react-toastify';
import { useFilters } from '@/context/FiltersContext';

export function ConcluirAcao() {
  const [isOpenConcluirModal, setIsOpenConcluirModal] = useState(false);
  const [isConcluindoAcao, setIsConcluindoAcao] = useState(false);
  const [motivo, setMotivo] = useState('');
  const { acoes, setDenuncias, setAcoes } = useOcorrencias();
  const { acaoId } = useParams();
  const {
    cacheCurrentFilters,
    restoreCachedFilters,
    setIsVisibleDenunciasInMap,
    setFiltrarAcoesPorId,
  } = useFilters();

  const navigate = useNavigate();

  const acao = useMemo(() => {
    return acoes.find((ac) => ac.id === Number(acaoId));
  }, [acoes, acaoId]);

  const acaoStatus = useMemo(() => {
    if (!acao) return null;
    return acao.status[0]?.status;
  }, [acao]);

  if (
    !acao ||
    !acaoStatus ||
    !['em_analise', 'em_andamento'].includes(acaoStatus)
  ) {
    return <Navigate to="/404" />;
  }

  function handleOnConcluirAcaoConfirmation() {
    if (!acao) return;

    try {
      setIsConcluindoAcao(true);

      const concluirAcaoStatus: AcaoStatusModel = {
        id: Math.random(),
        motivo: motivo,
        AlteradoEm: Date.now().toString(),
        alteradoPor: userMock,
        status: 'concluido',
      };

      const acaoConcluidaData: AcaoModel = {
        ...acao,
        status: [...acao.status, concluirAcaoStatus],
      };

      setDenuncias((prev) =>
        prev.map((denuncia) => {
          if (denuncia?.acao && denuncia.acao.id === acao.id) {
            return {
              ...denuncia,
              acao: acaoConcluidaData,
            };
          }
          return denuncia;
        }),
      );

      setAcoes((prev) =>
        prev.map((a) => {
          if (a.id === acao.id) {
            return acaoConcluidaData;
          }
          return a;
        }),
      );

      navigate(`/ocorrencias/acoes/${acaoId}`);
      toast.success('Ação concluída com sucesso!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsConcluindoAcao(false);
    }
  }

  useEffect(() => {
    cacheCurrentFilters();
    setIsVisibleDenunciasInMap(false);

    if (acao) {
      setFiltrarAcoesPorId([acao.id]);
    }

    return () => {
      restoreCachedFilters();
    };
  }, [acao]);

  return (
    <>
      <div className="flex flex-col gap-4 h-full ">
        <BackButton>Concluir Ação</BackButton>

        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
          <div className="flex items-center">
            <FaCheck className="text-green-500 text-xl mr-3" />
            <div>
              <p className="text-sm font-semibold text-green-800">
                Você está concluindo a ação:
              </p>
              <p className="font-bold text-green-900 text-lg">{acao.nome}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col space-y-6 overflow-y-auto pr-2">
          <div>
            <label
              htmlFor="relatorio-conclusao"
              className="block font-semibold text-slate-800 mb-2"
            >
              Relatório de Conclusão
            </label>
            <div className="relative">
              <textarea
                id="relatorio-conclusao"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                rows={6}
                maxLength={500}
                className="w-full resize-none border-slate-300 rounded-md shadow-sm p-3 text-slate-700 text-sm
                           focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                placeholder="Descreva o que foi feito para concluir esta ação..."
              />
              <span className="absolute bottom-2 right-3 text-xs text-slate-400">
                {motivo.length} / 500
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-slate-800 font-semibold mb-3">
              Ou selecione um relatório rápido
            </h4>
            <div className="flex flex-wrap gap-2">
              {/* Usando a nova lista de mensagens */}
              {mensagensSugeridasParaConcluirAcao.map((message) => (
                <button
                  key={message}
                  onClick={() => setMotivo(message)}
                  className="px-4 py-2 text-xs text-start border border-slate-300 rounded-full text-slate-700 
                             font-medium hover:bg-green-50 hover:border-green-400 hover:text-green-700 
                             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
                >
                  {message}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={() => setIsOpenConcluirModal(true)}
            disabled={!motivo.trim() || isConcluindoAcao}
            className="flex items-center justify-center w-full bg-green-600 text-white font-semibold py-2 rounded-lg transition-colors hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaCheck className="mr-2" />
            {isConcluindoAcao ? 'Indeferindo...' : 'Confirmar Indeferimento'}
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={isOpenConcluirModal}
        title="Concluir Ação"
        message="Você tem certeza que deseja concluir esta ação? Esta operação não pode ser desfeita."
        onCancel={() => setIsOpenConcluirModal(false)}
        onConfirm={() => handleOnConcluirAcaoConfirmation()}
      />
    </>
  );
}
