import { Switch } from '../Switch';
import { useFilters } from '../../context/FiltersContext';
import { useMapActions } from '../../context/MapActions';

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
        <img src="/icons/denuncia.png" alt="Denuncias" className="w-6 h-6" />

        <Switch
          isActive={isVisibleDenunciasInMap}
          onToogle={() => setIsVisibleDenunciasInMap(!isVisibleDenunciasInMap)}
          disabled={disableMapFilters}
        />
      </div>

      <div className="flex items-center gap-2 bg-white rounded-lg p-2">
        <img src="/icons/acao.png" alt="Denuncias" className="w-6 h-6" />

        <Switch
          isActive={isVisibleAcoesInMap}
          onToogle={() => setIsVisibleAcoesInMap(!isVisibleAcoesInMap)}
          disabled={disableMapFilters}
        />
      </div>
    </div>
  );
}
