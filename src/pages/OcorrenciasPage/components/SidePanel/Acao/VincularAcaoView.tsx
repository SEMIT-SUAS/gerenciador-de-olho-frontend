import { useNavigate, useParams } from 'react-router-dom';
import { BackButton } from '../../../../../components/ui/Backbutton';
import { useEffect, useMemo, useState } from 'react';
import { ConfirmModal } from '../../../../../components/Modals/ConfirmModal';
import { useFilters } from '@/context/FiltersContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import AcoesService from '@/services/acoesService';
import type { AcaoModel } from '@/types/Acao';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { IconTrash } from '@tabler/icons-react';

export function VincularDenunciasAcao() {
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);
  const [acao, setAcao] = useState<AcaoModel | null>(null);
  const [denunciasSelecionadas, setDenunciasSelecionadas] = useState<number[]>(
    [],
  );

  const { denunciasDoBairro } = useFilters();
  const params = useParams();
  const acaoId = Number(params.id);
  const navigate = useNavigate();

  useEffect(() => {
    AcoesService.getAcaoById(acaoId)
      .then(setAcao)
      .catch(() => toast.error('Erro ao buscar detalhes da ação.'));
  }, [acaoId]);

  const denunciasDisponiveis = useMemo(() => {
    return denunciasDoBairro.filter((d) => !d.idAcao);
  }, [denunciasDoBairro]);

  // Função para adicionar ou remover uma denúncia da seleção
  const handleToggleDenuncia = (denunciaId: number) => {
    setDenunciasSelecionadas((prev) =>
      prev.includes(denunciaId)
        ? prev.filter((id) => id !== denunciaId)
        : [...prev, denunciaId],
    );
  };

  // Função principal que chama o serviço para vincular
  async function handleConfirmarVinculo() {
    if (!acao || denunciasSelecionadas.length === 0) {
      toast.error('Selecione pelo menos uma denúncia para vincular.');
      return;
    }

    try {
      setIsOpenConfirmationModal(false);

      const denunciasJaVinculadasIds = acao.denuncias.map((d) => d.id);
      const payload = {
        acaoId: acao.id,
        denuncias: [...denunciasJaVinculadasIds, ...denunciasSelecionadas],
      };

      //ATUALIZAR ESTADO DA AÇÃO
      //FILTRAR NOVAMENTE A DATA

      navigate(`/ocorrencias/acoes/${acao.id}`);
      toast.success('Denúncias vinculadas com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Falha ao vincular denúncias.');
    }
  }

  if (!acao) {
    return <div>Carregando ação...</div>;
  }

  return (
    <>
      <div className="flex gap-4 flex-col h-full">
        <BackButton
          to={`/ocorrencias/acoes/${acaoId}`}
          children="Vincular Denúncias à Ação"
        />

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">Ação selecionada:</p>
          <p className="font-bold text-blue-900">{acao.nome}</p>
        </div>

        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Denúncias Selecionadas</CardTitle>
            <CardDescription>
              As denúncias abaixo foram selecionadas no mapa para esta ação.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {denunciasDisponiveis.length > 0 ? (
              <div className="flex flex-col gap-2">
                {denunciasDisponiveis.map((denuncia) => (
                  <Card>
                    <CardHeader className="flex items-center justify-between">
                      <CardTitle>{denuncia.nomeTipoDenuncia}</CardTitle>
                      <CardDescription>
                        <Button
                          size="icon"
                          onClick={() => handleToggleDenuncia(denuncia.id)}
                        >
                          <IconTrash />
                        </Button>
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhuma denúncia selecionada no mapa.
              </p>
            )}
          </CardContent>
        </Card>

        <Button
          onClick={() => setIsOpenConfirmationModal(true)}
          disabled={denunciasSelecionadas.length === 0}
        >
          Vincular {denunciasSelecionadas.length} denúncia(s)
        </Button>
      </div>

      <ConfirmModal
        isOpen={isOpenConfirmationModal}
        title="Vincular Denúncias"
        message={`Deseja vincular ${denunciasSelecionadas.length} denúncia(s) à ação "${acao?.nome}"?`}
        onCancel={() => setIsOpenConfirmationModal(false)}
        onConfirm={handleConfirmarVinculo}
      />
    </>
  );
}
