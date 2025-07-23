import { useFilters } from '../../../context/FiltersContext';
import { FilterStatusSelect } from '../Filters/FilterStatusSelect';
import { SelectSecretariaFilter } from '../Filters/SelectSecretariaFilter';
import { AcaoItem } from './AcaoItem';

export function AcoesList() {
  const {
    acoesFiltradas,
    setFiltroStatusAcao,
    filtroStatusAcao,
    setFiltroSecretaria,
  } = useFilters();

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-1">
        <FilterStatusSelect
          id="status-filter-select"
          label="Status"
          onStatusChange={(status) =>
            setFiltroStatusAcao(status == 'todos' ? 'todos' : [status])
          }
          value={filtroStatusAcao == 'todos' ? 'todos' : filtroStatusAcao[0]}
        />

        <SelectSecretariaFilter
          onSecretariaChange={(secretaria) => setFiltroSecretaria(secretaria)}
        />
      </div>

      {acoesFiltradas.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">
          Nenhuma ação encontrada.
        </p>
      ) : (
        acoesFiltradas.map((acao) => <AcaoItem key={acao.id} acao={acao} />)
      )}
    </div>
  );
}
