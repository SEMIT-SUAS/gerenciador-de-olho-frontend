import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';

// UI Components
import { BackButton } from '../../../../../components/ui/Backbutton';
import { ConfirmModal } from '../../../../../components/Modals/ConfirmModal';
import { Button } from '@/components/ui/button';
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

// Services and Types
import AcoesService from '@/services/acoesService';
import { DenunciaService } from '@/services/DenunciaService';
import type { DenunciaModel } from '@/types/Denuncia';
import type { AcaoDetailsModel } from '@/types/Acao';

// Contexts and Utils
import { useFilters } from '@/context/FiltersContext';
import { useMapActions } from '../../../../../context/MapActions';
import { getPolygonoCenter } from '@/utils/geometry';

export function VincularDenunciaAAcao() {
  // --- STATE MANAGEMENT ---
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);
  const [acaoData, setAcaoData] = useState<AcaoDetailsModel | null>(null);
  const [denuncia, setDenuncia] = useState<DenunciaModel | null>(null);

  // --- HOOKS ---
  const { setIsVisibleDenunciasInMap, setIsVisibleAcoesInMap, filtrarData } =
    useFilters();
  const { setSalvarAcaoOnclick, acaoSelecionada, setAcaoSelecionada } =
    useMapActions();
  const params = useParams();
  const denunciaId = Number(params.id);
  const navigate = useNavigate();

  // --- DATA FETCHING AND LOGIC (MEMOIZED FUNCTIONS) ---

  // Função para buscar a denúncia principal, agora memoizada com useCallback
  const fetchDenuncia = useCallback(async () => {
    try {
      const denunciaData = await DenunciaService.getById(denunciaId);
      setDenuncia(denunciaData);
    } catch (error) {
      toast.error('Erro ao buscar denúncia.');
      console.error(error);
    }
  }, [denunciaId]);

  // Função para vincular a denúncia, agora memoizada com useCallback
  const handleVincularDenuncia = useCallback(async () => {
    if (!denuncia || !acaoData) {
      toast.error('Por favor, selecione uma denúncia e uma ação.');
      return;
    }

    setIsOpenConfirmationModal(false);
    try {
      const todasCoordenadas = [
        ...acaoData.denuncias.map(
          (d) =>
            [d.endereco.latitude, d.endereco.longitude] as [number, number],
        ),
        [denuncia.latitude, denuncia.longitude] as [number, number],
      ];
      const centerCoordinates = getPolygonoCenter(todasCoordenadas);

      const payload = {
        id: acaoData.acao.id,
        latitude: centerCoordinates[0],
        longitude: centerCoordinates[1],
        denuncias: [denunciaId],
      };

      await AcoesService.vincularDenunciaAcao(payload);

      filtrarData({
        denunciaStatusParam: acaoData.acao.acaoStatus.status,
        acaoStatusParam: acaoData.acao.acaoStatus.status,
        tipoDaDenunciaParam: null,
      });
      toast.success('Denúncia vinculada com sucesso!');
      navigate(`/ocorrencias/acoes/${acaoData.acao.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Falha ao vincular denúncia.');
    }
  }, [denuncia, acaoData, denunciaId, navigate]);

  useEffect(() => {
    fetchDenuncia();
    setIsVisibleDenunciasInMap(false);
    setIsVisibleAcoesInMap(true);
    filtrarData({
      acaoStatusParam: 'Análise',
      denunciaStatusParam: 'Análise',
      tipoDaDenunciaParam: null,
    });

    return () => {
      setIsVisibleDenunciasInMap(true);
    };
  }, [denunciaId]);

  useEffect(() => {
    if (!acaoSelecionada) {
      setAcaoData(null);
      return;
    }
    const fetchAcaoDetails = async () => {
      try {
        setAcaoData(null);
        const acaoDataResponse = await AcoesService.getAcaoById(
          acaoSelecionada.id,
        );
        setAcaoData(acaoDataResponse);
      } catch (error) {
        toast.error('Erro ao buscar detalhes da ação.');
        console.error(error);
      }
    };
    fetchAcaoDetails();
  }, [acaoSelecionada]);

  useEffect(() => {
    setSalvarAcaoOnclick(true);
    return () => {
      setSalvarAcaoOnclick(false);
      setAcaoSelecionada(null);
    };
  }, [setSalvarAcaoOnclick, setAcaoSelecionada]);

  // --- RENDER ---
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
                <CardDescription className="font-semibold text-lg text-secundary">
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
                  <div className="flex flex-col gap-3 max-h-48 overflow-y-auto">
                    {acaoData.denuncias.length > 0 ? (
                      acaoData.denuncias.map((d) => (
                        <Card key={d.id}>
                          <CardHeader className="p-3">
                            <CardTitle className="text-sm">
                              {d.nomeTipoDenuncia}
                            </CardTitle>
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
          disabled={!acaoData}
        >
          Vincular à ação
        </Button>
      </div>

      <ConfirmModal
        isOpen={isOpenConfirmationModal}
        title="Vínculo de denúncia à ação"
        message={`Você deseja vincular a denúncia "${denuncia?.tipoDenuncia.nome}" à ação "${acaoData?.acao.nome}"?`}
        onCancel={() => setIsOpenConfirmationModal(false)}
        onConfirm={handleVincularDenuncia}
      />
    </>
  );
}
