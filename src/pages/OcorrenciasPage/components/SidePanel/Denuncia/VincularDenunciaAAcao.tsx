import { useNavigate, useParams } from 'react-router-dom';
import { BackButton } from '../../../../../components/ui/Backbutton';
import { useEffect, useState } from 'react';
import { ConfirmModal } from '../../../../../components/Modals/ConfirmModal';
import { useFilters } from '@/context/FiltersContext';
import { useMapActions } from '../../../../../context/MapActions';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import AcoesService from '@/services/acoesService';
import { DenunciaService } from '@/services/DenunciaService';
import type { DenunciaModel } from '@/types/Denuncia';
import { getPolygonoCenter } from '@/utils/geometry';
import type { AcaoDetailsModel } from '@/types/Acao';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Building2Icon,
  CalendarIcon,
  Link2Icon,
  MousePointerSquareDashedIcon,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function VincularDenunciaAAcao() {
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);
  const [acaoData, setAcaoData] = useState<AcaoDetailsModel | null>(null);

  const { setIsVisibleDenunciasInMap, setIsVisibleAcoesInMap, filtrarData } =
    useFilters();
  const [denuncia, setDenuncia] = useState<DenunciaModel>();

  const { setSalvarAcaoOnclick, acaoSelecionada, setAcaoSelecionada } =
    useMapActions();

  const params = useParams();
  const denunciaId = Number(params.id);
  const navigate = useNavigate();

  async function fetchDenuncia() {
    try {
      const denuncia = await DenunciaService.getById(denunciaId);
      setDenuncia(denuncia);
    } catch (error) {
      toast.error('Erro ao buscar denúncia.');
      console.error(error);
      return null;
    }
  }

  useEffect(() => {
    fetchDenuncia();
    setIsVisibleDenunciasInMap(false);
    setIsVisibleAcoesInMap(true);
    filtrarData({
      acaoStatusParam: 'Análise',
      denunciaStatusParam: 'Aberto',
      tipoDaDenunciaParam: null,
    });

    return () => {
      setIsVisibleDenunciasInMap(true);
      filtrarData({
        acaoStatusParam: 'Análise',
        denunciaStatusParam: 'Análise',
        tipoDaDenunciaParam: null,
      });
    };
  }, [denunciaId, setIsVisibleDenunciasInMap, setIsVisibleAcoesInMap]);

  useEffect(() => {
    setSalvarAcaoOnclick(true);
    // AcoesService.getAcaoById(acaoSelecionada!.id)
    //   .then((acaoDataResponse) => setAcaoData(acaoDataResponse))
    //   .catch(() => toast.error('Erro ao buscar detalhes da ação.'));

    return () => {
      setSalvarAcaoOnclick(false);
      setAcaoSelecionada(null);
    };
  }, [setSalvarAcaoOnclick, setAcaoSelecionada]);

  useEffect(() => {
    // Se não há ação selecionada, limpa os dados antigos e para.
    if (!acaoSelecionada) {
      setAcaoData(null);
      return;
    }

    // Função assíncrona para buscar os detalhes
    async function fetchAcaoDetails() {
      try {
        setAcaoData(null); // Limpa dados antigos para evitar "stale data"
        const acaoDataResponse = await AcoesService.getAcaoById(
          acaoSelecionada!.id,
        );
        setAcaoData(acaoDataResponse); // Define os novos dados
      } catch (error) {
        toast.error('Erro ao buscar detalhes da ação.');
        console.error(error);
      } finally {
      }
    }

    fetchAcaoDetails();
  }, [acaoSelecionada]); // A dependência continua a mesma

  async function handleVincularDenuncia() {
    if (!denuncia || !acaoData || !acaoSelecionada) {
      toast.error('Por favor, selecione uma denúncia e uma ação.');
      return;
    }

    try {
      setIsOpenConfirmationModal(false);

      const todasCoordenadas = [
        ...acaoData.denuncias.map(
          // <-- Remova o '!' pois a validação acima já garante que não é nulo
          (d) =>
            [d.endereco.latitude, d.endereco.longitude] as [number, number],
        ),
        [denuncia.latitude, denuncia.longitude] as [number, number],
      ];

      const centerCoordinates = getPolygonoCenter(todasCoordenadas);

      console.log(centerCoordinates);
      const payload = {
        id: acaoSelecionada.id,
        latitude: centerCoordinates[0],
        longitude: centerCoordinates[1],
        denuncias: [denunciaId],
      };

      await AcoesService.vincularDenunciaAcao(payload);

      navigate(`/ocorrencias/acoes/${acaoSelecionada.id}`);
      toast.success('Denúncia vinculada com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Falha ao vincular denúncia.');
    }
  }

  return (
    <>
      <div className="flex gap-4 flex-col h-full">
        <BackButton
          to={`/ocorrencias/denuncias/${denunciaId}`}
          children="Vincular Denúncia"
        />

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">Vinculando denúncia:</p>
          <p className="font-bold text-blue-900">
            {denuncia?.tipoDenuncia.nome}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-gray-800">Ação selecionada:</h3>
          {acaoData ? (
            <Card>
              <CardHeader>
                <CardDescription className=" font-semibold text-lg text-secundary">
                  {acaoData.acao.nome}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {new Date(acaoData.acao.criadoEm).toLocaleDateString(
                        'pt-BR',
                      )}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Building2Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {acaoData.acao.siglaSecretaria}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="flex items-center font-semibold">
                    <Link2Icon className="mr-2 h-5 w-5" />
                    Denúncias já vinculadas ({acaoData.denuncias.length})
                  </h4>
                  <div className="flex flex-col gap-3">
                    {acaoData.denuncias.length > 0 ? (
                      acaoData.denuncias.map((denuncia) => (
                        <Card key={denuncia.id}>
                          <CardHeader className="flex items-center justify-between">
                            <CardTitle>{denuncia.nomeTipoDenuncia}</CardTitle>
                          </CardHeader>
                        </Card>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground pl-2">
                        Nenhuma denúncia vinculada a esta ação ainda.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="flex h-48 items-center justify-center border-2 border-dashed bg-muted/30">
              <div className="text-center">
                <MousePointerSquareDashedIcon className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-2 font-medium text-muted-foreground">
                  Selecione uma ação no mapa
                </p>
                <p className="text-sm text-muted-foreground/80">
                  Os detalhes aparecerão aqui.
                </p>
              </div>
            </Card>
          )}
        </div>

        <Button
          onClick={() => setIsOpenConfirmationModal(true)}
          disabled={!acaoSelecionada}
        >
          Víncular á ação
        </Button>
      </div>

      <ConfirmModal
        isOpen={isOpenConfirmationModal}
        title="Vínculo de denúncia à ação"
        message={`Você deseja vincular essa denúncia ${denuncia?.tipoDenuncia.nome} à essa ação ${acaoData?.acao.nome}?`}
        onCancel={() => setIsOpenConfirmationModal(false)}
        onConfirm={handleVincularDenuncia}
      />
    </>
  );
}
