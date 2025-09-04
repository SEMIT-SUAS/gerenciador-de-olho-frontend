import { useNavigate, useParams } from 'react-router-dom';
import { BackButton } from '../../../../../components/ui/Backbutton';
import { useEffect, useState } from 'react';
import { ConfirmModal } from '../../../../../components/Modals/ConfirmModal';
import { useFilters } from '@/context/FiltersContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import AcoesService from '@/services/acoesService';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { IconTrash } from '@tabler/icons-react';
import type { AcaoDetailsModel } from '@/types/Acao';
import { getPolygonoCenter } from '@/utils/geometry';
import type { DenunciaInMap } from '@/types/Denuncia';
import { useMapActions } from '@/context/MapActions';
import L from 'leaflet';

export function VincularAcaoView() {
  const { setSalvarDenunciasOnClick } = useMapActions();
  const { denunciasDoBairro } = useFilters();

  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);
  const [acaoData, setAcaoData] = useState<AcaoDetailsModel | null>(null);
  const {
    denunciasSelecionadas,
    setDenunciasSelecionadas,
    denunciasVinculadas,
    toggleDenunciaSelecionadas,
  } = useMapActions();

  const { filtrarData, setIsVisibleAcoesInMap } = useFilters();
  const params = useParams();
  const acaoId = Number(params.id);
  const navigate = useNavigate();

  useEffect(() => {
    AcoesService.getAcaoById(acaoId)
      .then((acaoDataResponse) => setAcaoData(acaoDataResponse))
      .catch(() => toast.error('Erro ao buscar detalhes da ação.'));
  }, [acaoId]);

  useEffect(() => {
    setSalvarDenunciasOnClick(true);

    filtrarData({
      acaoStatusParam: null,
      denunciaStatusParam: 'Aberto',
      tipoDaDenunciaParam: null,
    });

    return () => {
      setSalvarDenunciasOnClick(false);
      setDenunciasSelecionadas([]);

      filtrarData({
        acaoStatusParam: 'Análise',
        denunciaStatusParam: 'Análise',
        tipoDaDenunciaParam: null,
      });

      setAcaoData(null);
    };
  }, []);

  // const handleToggleDenuncia = (denuncia: DenunciaInMap) => {
  //   setDenunciasSelecionadas((prev) =>
  //     prev.some((d) => d.id === denuncia.id)
  //       ? prev.filter((d) => d.id !== denuncia.id)
  //       : [...prev, denuncia],
  //   );
  // };

  const handleAgruparProximas = () => {
    if (denunciasVinculadas.length === 0) {
      alert('Não há um agrupamento inicial para expandir.');
      return;
    }

    const centroideCalculado = denunciasVinculadas.reduce(
      (acc, d) => {
        acc.lat += d.latitude;
        acc.lng += d.longitude;
        return acc;
      },
      { lat: 0, lng: 0 },
    );

    const centroideReal = L.latLng(
      centroideCalculado.lat / denunciasVinculadas.length,
      centroideCalculado.lng / denunciasVinculadas.length,
    );

    const raio = Math.max(
      ...denunciasVinculadas.map((d) =>
        centroideReal.distanceTo([d.latitude, d.longitude]),
      ),
    );

    const denunciasRaio = denunciasDoBairro.filter(
      (d) => centroideReal.distanceTo([d.latitude, d.longitude]) <= raio,
    );

    setDenunciasSelecionadas([...denunciasSelecionadas, ...denunciasRaio]);
  };

  async function handleConfirmarVinculo() {
    if (!acaoData || denunciasSelecionadas.length === 0) {
      toast.error('Selecione pelo menos uma denúncia para vincular.');
      return;
    }

    try {
      setIsOpenConfirmationModal(false);

      const todasCoordenadas = [
        ...acaoData.denuncias.map(
          (d) =>
            [d.endereco.latitude, d.endereco.longitude] as [number, number],
        ),

        ...denunciasSelecionadas.map(
          (d) => [d.latitude, d.longitude] as [number, number],
        ),
      ];

      const centerCoordinates = getPolygonoCenter(todasCoordenadas);

      const payload = {
        id: acaoData.acao.id,
        latitude: centerCoordinates[0],
        longitude: centerCoordinates[1],
        denuncias: [...denunciasSelecionadas.map((d) => d.id)],
      };

      await AcoesService.vincularDenunciaAcao(payload);

      navigate(`/ocorrencias/acoes/${acaoData.acao.id}`);
      toast.success('Denúncias vinculadas com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Falha ao vincular denúncias.');
    }
  }

  useEffect(() => {
    setSalvarDenunciasOnClick(true);
    setIsVisibleAcoesInMap(false);

    return () => {
      setSalvarDenunciasOnClick(false);
      setIsVisibleAcoesInMap(true);
    };
  }, [setSalvarDenunciasOnClick]); //

  if (!acaoData) {
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
          <p className="font-bold text-blue-900">{acaoData.acao.nome}</p>
        </div>

        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Denúncias Selecionadas</CardTitle>
            <CardDescription>
              As denúncias abaixo foram selecionadas no mapa para esta ação.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {denunciasSelecionadas.length > 0 ? (
              <div className="flex flex-col gap-2">
                {denunciasSelecionadas.map((denuncia) => (
                  <Card key={denuncia.id}>
                    <CardHeader className="flex items-center justify-between">
                      <CardTitle>{denuncia.nomeTipoDenuncia}</CardTitle>
                      <CardDescription>
                        <Button
                          size="icon"
                          onClick={() => toggleDenunciaSelecionadas(denuncia)}
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
        <Button onClick={handleAgruparProximas} variant={'outline'}>
          Selecionar denúncias dentro do raio
        </Button>
      </div>

      <ConfirmModal
        isOpen={isOpenConfirmationModal}
        title="Vincular Denúncias"
        message={`Deseja vincular ${denunciasSelecionadas.length} denúncia(s) à ação "${acaoData?.acao.nome}"?`}
        onCancel={() => setIsOpenConfirmationModal(false)}
        onConfirm={handleConfirmarVinculo}
      />
    </>
  );
}
