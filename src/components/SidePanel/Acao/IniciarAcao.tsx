import { toast } from 'react-toastify'; // Exemplo de importação de toast
import React from 'react'; // Importação do React para tipos de estado
import type { AcaoModel } from '@/types/Acao';
import type { DenunciaModel } from '@/types/Denuncia';
import type { AcaoStatusModel } from '@/types/AcaoStatus';

interface HandleIniciarAcaoParams {
  acao: AcaoModel | null | undefined;
  setAcoes: React.Dispatch<React.SetStateAction<AcaoModel[]>>;
  setDenuncias: React.Dispatch<React.SetStateAction<DenunciaModel[]>>;
}

export const handleIniciarAcao = ({
  acao,
  setAcoes,
  setDenuncias,
}: HandleIniciarAcaoParams) => {
  if (!acao) {
    console.error('Ação não fornecida para handleIniciarAcao.');
    toast.warn('Ação não encontrada. Tente novamente.');
    return;
  }

  try {
    const novoStatus: AcaoStatusModel = {
      id: Math.random(),
      motivo: null, // Não precisamos de motivo para iniciar a ação
      AlteradoEm: new Date().toISOString(),
      alteradoPor: {
        id: 1,
        nome: 'Usuário Padrão',
        cpf: '',
        telefone: '',
        email: '',
        senha: '',
        perfil: 1, // Substitua por um valor válido de PerfilModel
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
      }, // Substitua pelos dados reais do usuário
      status: 'em_andamento', // O novo status da ação
    };

    const acaoAtualizada: AcaoModel = {
      ...acao,
      status: [...acao.status, novoStatus],
    };

    setAcoes((prevAcoes) =>
      prevAcoes.map((a) => (a.id === acao.id ? acaoAtualizada : a)),
    );

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
  }
};
