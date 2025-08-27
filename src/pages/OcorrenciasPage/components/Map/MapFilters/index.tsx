import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { FilterDenunciaByCategoriaTipoSelect } from './FilterDenunciaByCategoriaTipoSelect';
import { FilterDenunciaStatusSelect } from './FilterDenunciaStatusSelect';
import AcaoIcon from '/public/icons/acao.png';
import DenunciaIcon from '/public/icons/denuncia.png';
import { IconX } from '@tabler/icons-react';
import { useMapActions } from '@/context/MapActions';
import { useFilters } from '@/context/FiltersContext';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { initialFiltersValues } from '@/context/FiltersContext/initialFilterValues';

export function MapFilters() {
  const { setCurrentBairroId, currentBairroId, setZoomTo } = useMapActions();
  const {
    setFiltrarTipoDenuncia,
    setFiltroStatusDenuncia,
    isVisibleDenunciasInMap,
    isVisibleAcoesInMap,
    setIsVisibleDenunciasInMap,
    setIsVisibleAcoesInMap,
    denunciasDoBairro,
    setAcoesDoBairro,
    setDenunciasDoBairro,
    filtrarData,
    isLoading,
    isDisabledFiltersInMap,
    filtroStatusDenuncia,
    filtroTipoDenuncia,
  } = useFilters();

  const navigate = useNavigate();

  const handleZoomOut = () => {
    setCurrentBairroId(null);
    setAcoesDoBairro([]);
    setDenunciasDoBairro([]);
    setZoomTo({ lat: -2.51, lng: -44.28, level: 13 });
  };

  if (!currentBairroId) {
    return null;
  }

  const handleClearFilters = () => {
    setFiltrarTipoDenuncia(initialFiltersValues.filtroTipoDenuncia);
    setFiltroStatusDenuncia(initialFiltersValues.filtroStatusDenuncia);
  };

  const handleApplyFilters = async () => {
    await filtrarData({
      acaoStatusParam:
        filtroStatusDenuncia !== 'Aberto' ? filtroStatusDenuncia : null,
      denunciaStatusParam: filtroStatusDenuncia,
      tipoDaDenunciaParam: filtroTipoDenuncia,
    });
  };

  return (
    <>
      <div className="absolute z-20 top-9 left-12">
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-bold">Filtros</h2>

          <div className="flex gap-3">
            <FilterDenunciaByCategoriaTipoSelect />
            <FilterDenunciaStatusSelect />
          </div>

          <div className="flex gap-3">
            <Button onClick={handleApplyFilters} disabled={isLoading}>
              {isLoading && <Loader2 className="animate-spin" />} Filtrar
            </Button>
            <Button
              onClick={handleClearFilters}
              variant="outline"
              className="text-gray-600"
              disabled={isLoading || isDisabledFiltersInMap}
            >
              <IconX /> Limpar Filtros
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute z-20 bottom-9 left-12">
        <Button
          className="w-56"
          onClick={() => navigate('/ocorrencias/acoes/criar')}
          disabled={denunciasDoBairro.length === 0}
        >
          Criar ação
          <img src={AcaoIcon} alt="Icone de denúncia" className="h-6 w-6" />
        </Button>
        <Button
          className="inline-flex ml-3"
          variant={'outline'}
          onClick={handleZoomOut}
          disabled={isLoading || isDisabledFiltersInMap}
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
            <Switch
              disabled={isLoading || isDisabledFiltersInMap}
              checked={isVisibleDenunciasInMap}
              onClick={() =>
                setIsVisibleDenunciasInMap(!isVisibleDenunciasInMap)
              }
              id="denuncia-switch"
            />
          </CardContent>
        </Card>

        <Card className={`w-24 ${cn('py-3')}`}>
          <CardContent
            className={`flex items-center justify-between ${cn('px-3')}`}
          >
            <label htmlFor="acao-switch">
              <img src={AcaoIcon} alt="Icone de ação" className="h-6 w-6" />
            </label>
            <Switch
              disabled={isLoading || isDisabledFiltersInMap}
              checked={isVisibleAcoesInMap}
              onClick={() => setIsVisibleAcoesInMap(!isVisibleAcoesInMap)}
              id="acao-switch"
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
