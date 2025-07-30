import { AcaoModel, AcaoStatusModel, DenunciaModel, UserModel } from '@/models'; // Exemplo de importação de tipos
import { toast } from 'react-toastify'; // Exemplo de importação de toast
import React from 'react'; // Importação do React para tipos de estado

interface HandleIniciarAcaoParams {
  acao: AcaoModel | null | undefined;
  user: UserModel;
  setAcoes: React.Dispatch<React.SetStateAction<AcaoModel[]>>;
  setDenuncias: React.Dispatch<React.SetStateAction<DenunciaModel[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const handleIniciarAcao = ({
  acao,
  user,
  setAcoes,
  setDenuncias,
  setIsLoading,
}: HandleIniciarAcaoParams) => {
  if (!acao) {
    console.error('Ação não fornecida para handleIniciarAcao.');
    toast.warn('Ação não encontrada. Tente novamente.');
    return;
  }

  try {
    setIsLoading(true);

    const novoStatus: AcaoStatusModel = {
      id: Math.random(),
      motivo: null, // Não precisamos de motivo para iniciar a ação
      AlteradoEm: new Date().toISOString(),
      alteradoPor: user,
      status: 'em_andamento', // O novo status da ação
    };

    const acaoAtualizada: AcaoModel = {
      ...acao,
      status: [...acao.status, novoStatus],
    };

    // TODO: Chamar a API aqui para persistir a 'acaoAtualizada' no backend

    // Atualiza o estado global/local de Ações
    setAcoes((prevAcoes) =>
      prevAcoes.map((a) => (a.id === acao.id ? acaoAtualizada : a)),
    );

    // Atualiza o estado de Denúncias que possam estar vinculadas a esta Ação
    setDenuncias((prevDenuncias) =>
      prevDenuncias.map((denuncia) => {
        if (denuncia?.acao?.id === acao.id) {
          return { ...denuncia, acao: acaoAtualizada };
        }
        return denuncia;
      }),
    );

    toast.success('Ação iniciada com sucesso!');
  } catch (error: any) {
    toast.error(error.message || 'Ocorreu um erro ao iniciar a ação.');
  } finally {
    setIsLoading(false);
  }
};
