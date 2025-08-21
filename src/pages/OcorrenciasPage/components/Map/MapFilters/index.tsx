import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { FilterAcaoSecretariaSelect } from './FilterAcaoSecretariaSelect';
import { FilterAcaoStatusSelect } from './FilterAcaoStatusSelect';
import { FilterDenunciaByCategoriaTipoSelect } from './FilterDenunciaByCategoriaTipoSelect';
import { FilterDenunciaStatusSelect } from './FilterDenunciaStatusSelect';

import AcaoIcon from '/public/icons/acao.png';
import DenunciaIcon from '/public/icons/denuncia.png';
import { IconX } from '@tabler/icons-react';
import { useMapActions } from '@/context/MapActions';
import { DenunciaService } from '@/services/DenunciaService';
import { use, useState } from 'react';
import { useFilters } from '@/context/FiltersContext';
import { useAuth } from '@/context/AuthContext';
import { DADOS_BAIRROS } from '@/constants/dadosDeBairros';
import AcoesService from '@/services/acoesService';

export function MapFilters() {
  const { setCurrentBairroId, currentBairroId, setZoomTo } = useMapActions();
  const {
    setDenunciasDoBairro,
    setAcoesDoBairro,
    setFiltrarTipoDenuncia,
    setFiltroStatusDenuncia,
    filtroTipoDenuncia,
    filtroStatusDenuncia,
  } = useFilters();
  const { user } = useAuth();

  if (!currentBairroId) {
    return null;
  }

  const handleZoomOut = () => {
    setCurrentBairroId(null);
    setZoomTo({ lat: -2.51, lng: -44.28, level: 13 });
  };

  const [tempFilters, setTempFilters] = useState({
    bairroId: '',
    denunciaStatus: 'Aberto',
    tipoDenuncia: '',
    acaoStatus: 'Andamento',
  });

  const handleStatusChange = (value: string) => {
    setTempFilters((prev) => ({ ...prev, denunciaStatus: value }));
  };

  const handleTipoDenunciaChange = (value: string) => {
    setTempFilters((prev) => ({ ...prev, tipoDenuncia: value }));
  };

  const handleApplyFilters = async () => {
    try {
      const denunciaParams = {
        bairro: DADOS_BAIRROS.find((b) => b.id === currentBairroId)!.nome,

        status: tempFilters.denunciaStatus,

        secretaria: user!.idSecretaria,

        'tipo-denuncia': tempFilters.tipoDenuncia,
      };

      const acaoParams = {
        bairro: DADOS_BAIRROS.find((b) => b.id === currentBairroId)!.nome,

        status: tempFilters.denunciaStatus,

        secretaria: user!.idSecretaria,
      };

      const denunciaFiltradas = await DenunciaService.getDenunciaPorBairro(
        denunciaParams,
      );

      const acaoFiltradas = await AcoesService.getFilteredAcoes(acaoParams);

      setAcoesDoBairro(acaoFiltradas);
      setDenunciasDoBairro(denunciaFiltradas);
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  };

  return (
    <>
      <div className="absolute z-20 top-9 left-12">
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-bold">Filtros</h2>

          <div className="flex gap-3">
            <FilterDenunciaByCategoriaTipoSelect
              onValueChange={handleTipoDenunciaChange}
            />
            <FilterDenunciaStatusSelect onValueChange={handleStatusChange} />
          </div>

          <div className="flex gap-3">
            <Button onClick={handleApplyFilters}>Filtrar</Button>
            <Button variant="outline" className="text-gray-600">
              <IconX /> Limpar Filtros
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute z-20 bottom-9 left-12">
        <Button className="w-56">
          Criar ação
          <img src={AcaoIcon} alt="Icone de denúncia" className="h-6 w-6" />
        </Button>
        <Button
          className="inline-flex ml-3"
          variant={'outline'}
          onClick={handleZoomOut}
        >
          <IconX />
          Limpar seleção
        </Button>
      </div>

      <div className="absolute z-20 bottom-9 right-12 space-y-3">
        <Card className={`w-24 ${cn('py-3')}`}>
          <CardContent
            className={`flex items-center justify-between ${cn('px-3')}`}
          >
            <label htmlFor="denuncia-switch">
              <img
                src={DenunciaIcon}
                alt="Icone de denúncia"
                className="h-6 w-6"
              />
            </label>
            <Switch id="denuncia-switch" />
          </CardContent>
        </Card>

        <Card className={`w-24 ${cn('py-3')}`}>
          <CardContent
            className={`flex items-center justify-between ${cn('px-3')}`}
          >
            <label htmlFor="acao-switch">
              <img src={AcaoIcon} alt="Icone de ação" className="h-6 w-6" />
            </label>
            <Switch id="acao-switch" />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
