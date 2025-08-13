import { useFilters } from '@/context/FiltersContext';
import { useMapActions } from '@/context/MapActions';
import { Switch } from '@/components/ui/switch';

export function MapFilters() {
  const {
    isVisibleDenunciasInMap,
    isVisibleAcoesInMap,
    setIsVisibleDenunciasInMap,
    setIsVisibleAcoesInMap,
  } = useFilters();

  const { disableMapFilters } = useMapActions();

  return (
    <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
      <div className="flex items-center gap-2 bg-white rounded-lg p-2">
        <img
          src="/icons/denuncia.png"
          alt="Icone de Denuncias"
          className="w-6 h-6"
        />

        <Switch
          disabled={disableMapFilters}
          checked={isVisibleDenunciasInMap}
          onCheckedChange={() =>
            setIsVisibleDenunciasInMap(!isVisibleDenunciasInMap)
          }
        />
      </div>

      <div className="flex items-center gap-2 bg-white rounded-lg p-2">
        <img src="/icons/acao.png" alt="icone de Açoes" className="w-6 h-6" />

        <Switch
          disabled={disableMapFilters}
          checked={isVisibleAcoesInMap}
          onCheckedChange={() => setIsVisibleAcoesInMap(!isVisibleAcoesInMap)}
        />
      </div>
    </div>
  );
}
