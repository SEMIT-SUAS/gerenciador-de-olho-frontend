import { useFilters } from '../../context/FiltersContext';
import { useOcorrenciasContext } from '../../context/ocorrenciasContext';
import { AcoesList } from './Acao/AcoesList';
import { FilterStatusSelect } from './Filters/FilterStatusSelect';
import { SelectSecretariaFilter } from './Filters/SelectSecretariaFilter';

export function AcoesTabContent() {
  const { setActualDetailItem } = useOcorrenciasContext();
  const {
    acoesFiltradas,
    setFiltroStatusAcao,
    filtroStatusAcao,
    setFiltroSecretaria,
  } = useFilters();

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar-blue">
      <div className="grid grid-cols-2 gap-1 pt-4 px-4">
        <FilterStatusSelect
          id="status-filter-select"
          label="Status"
          onStatusChange={(status) => setFiltroStatusAcao(status)}
          value={filtroStatusAcao}
        />

        <SelectSecretariaFilter
          onSecretariaChange={(secretaria) => setFiltroSecretaria(secretaria)}
        />
      </div>

      <div className="p-4">
        <AcoesList
          acoes={acoesFiltradas}
          onItemClick={(acao) => setActualDetailItem(acao)}
        />
      </div>
    </div>
  );
}
