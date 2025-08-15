import { BackButton } from '@/components/ui/Backbutton';
import { Button } from '@/components/ui/button'; // Supondo que você use este botão em algum lugar
import { ConfirmModal } from '@/components/Modals/ConfirmModal';
import { Textarea } from '@/components/ui/textarea'; // Supondo que você use este componente
import { mensagensSugeridasParaConcluirAcao } from '@/constants/MensagensConcluirAcao';
import { userMock } from '@/constants/mocks';
import { useFilters } from '@/context/FiltersContext';
import { useOcorrencias } from '@/context/OcorrenciasContext';
import type { AcaoModel } from '@/types/Acao';
import type { AcaoStatusModel } from '@/types/AcaoStatus';
import { useEffect, useMemo, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

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

      // O nome da ação aqui seria "Buracos na Rua dos Afogados" no seu exemplo
      const acaoConcluidaData: AcaoModel = {
        ...acao,
        status: [...acao.status, concluirAcaoStatus],
      };

      //TODO: CALL API

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
      <div className="flex flex-col gap-4 h-full space-y-7">
        <BackButton>Concluir Ação</BackButton>

        <div className="p-4 bg-green-100 rounded-md">
          <div className="flex items-center">
            <FaCheck className="text-green-600 text-xl mr-3" />
            <div>
              <p className="text-sm font-semibold text-green-800">
                Você está concluindo a ação:
              </p>
              <p className="font-bold text-green-900 text-lg">{acao.nome}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col space-y-6 overflow-y-auto">
          <div>
            <label
              htmlFor="relatorio-conclusao"
              className="block font-semibold text-slate-800 mb-2"
            >
              Relatório de Conclusão
            </label>
            <div className="relative">
              <Textarea
                id="relatorio-conclusao"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                rows={6}
                maxLength={500}
                className="min-h-[200px]"
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
              {mensagensSugeridasParaConcluirAcao.map((message) => (
                <button
                  key={message}
                  onClick={() => setMotivo(message)}
                  className="
                    w-full
                  cursor-pointer rounded-md border border-gray-300 px-3 py-1 
                  text-[13px] text-gray-500
                  transition-colors hover:border-gray-400 hover:bg-gray-100
                  focus:outline-none"
                >
                  {message}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button
            onClick={() => setIsOpenConcluirModal(true)}
            disabled={!motivo.trim() || isConcluindoAcao}
            className="w-full"
          >
            <FaCheck className="mr-2" />
            {isConcluindoAcao ? 'Concluindo...' : 'Confirmar Conclusão'}
          </Button>
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
