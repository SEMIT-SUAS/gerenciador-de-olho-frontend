import { BackButton } from '@/components/ui/Backbutton';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/Modals/ConfirmModal';
import { Textarea } from '@/components/ui/textarea';
import { mensagensSugeridasParaIndeferirAcao } from '@/constants/messagesRejectComplaint';
import { userMock } from '@/constants/mocks';
import { useFilters } from '@/context/FiltersContext';
import { useOcorrencias } from '@/context/OcorrenciasContext';
import type { AcaoModel } from '@/types/Acao';
import type { AcaoStatusModel } from '@/types/AcaoStatus';
import { useEffect, useMemo, useState } from 'react';
import { FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

export function IndeferirAcao() {
  const [isOpenIndeferirModal, setIsOpenIndeferirModal] = useState(false);
  const [isIndeferindoAcao, setIsIndeferindoAcao] = useState(false);
  const [motivo, setMotivo] = useState('');

  const { acoes, setAcoes, setDenuncias } = useOcorrencias();
  const {
    cacheCurrentFilters,
    restoreCachedFilters,
    setIsVisibleDenunciasInMap,
    setFiltrarAcoesPorId,
  } = useFilters();

  const acaoId = useParams().acaoId;
  const navigate = useNavigate();

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

  function handleOnIndeferirAcaoConfirmation() {
    if (!acao) return;

    try {
      setIsIndeferindoAcao(true);

      const indeferirAcaoStatus: AcaoStatusModel = {
        id: Math.random(),
        motivo,
        AlteradoEm: Date.now().toString(),
        alteradoPor: userMock,
        status: 'indeferido',
      };

      const acaoIndeferidaData: AcaoModel = {
        ...acao,
        status: [...acao.status, indeferirAcaoStatus],
      };

      //TODO: CALL API

      setDenuncias((prev) =>
        prev.map((denuncia) => {
          if (denuncia?.acao && denuncia.acao.id === acao.id) {
            return {
              ...denuncia,
              acao: acaoIndeferidaData,
            };
          }

          return denuncia;
        }),
      );

      setAcoes((prev) =>
        prev.map((a) => {
          if (a.id == acao.id) {
            return acaoIndeferidaData;
          }

          return a;
        }),
      );

      navigate(`/ocorrencias/acoes/${acaoId}`);
      toast.success('Ação indeferida com sucesso!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsIndeferindoAcao(false);
    }
  }

  useEffect(() => {
    cacheCurrentFilters();
    setIsVisibleDenunciasInMap(false);
    setFiltrarAcoesPorId([acao.id]);

    return () => {
      restoreCachedFilters();
    };
  }, []);

  return (
    <>
      <div className="flex flex-col gap-2 h-full space-y-7">
        <BackButton children="Indeferir Ação" />
        <div className="mb-6 p-4 bg-red-100 rounded-md">
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
              <Textarea
                id="motivo-indeferimento"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                rows={6}
                maxLength={500}
                className="min-h-[200px] "
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
                  className="w-full 
                  cursor-pointer rounded-md border border-gray-300 px-3 py-1 
                  text-[13px] text-gray-800
                  transition-colors hover:border-gray-400 hover:bg-gray-100
                  focus:outline-none"
                >
                  {message}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button
          onClick={() => setIsOpenIndeferirModal(true)}
          disabled={!motivo.trim() || isIndeferindoAcao}
        >
          <FaCheck className="mr-2" />
          {isIndeferindoAcao ? 'Indeferindo...' : 'Confirmar Indeferimento'}
        </Button>
      </div>

      <ConfirmModal
        isOpen={isOpenIndeferirModal}
        title="Indeferir Ação"
        message="Você realmente quer indeferir essa denúncia? Ação irreversível"
        onCancel={() => setIsOpenIndeferirModal(false)}
        onConfirm={() => handleOnIndeferirAcaoConfirmation()}
      />
    </>
  );
}
