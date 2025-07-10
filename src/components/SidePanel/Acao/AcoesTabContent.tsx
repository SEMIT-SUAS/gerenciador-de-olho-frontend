import { useFilters } from '../../../context/FiltersContext';
import { useOcorrenciasContext } from '../../../context/ocorrenciasContext';
import { AcoesList } from './AcoesList';
import { FilterStatusSelect } from '../Filters/FilterStatusSelect';
import { SelectSecretariaFilter } from '../Filters/SelectSecretariaFilter';
import { CreateAcaoForm } from '../../Forms/CreateAcaoForrm';
import { useAddAcao } from '../../../context/AddAcaoContext';

export function AcoesTabContent() {
  const { setActualDetailItem } = useOcorrenciasContext();
  const {
    acoesFiltradas,
    setFiltroStatusAcao,
    filtroStatusAcao,
    setFiltroSecretaria,
  } = useFilters();
  const { isAddingAcao } = useAddAcao();

  if (isAddingAcao) {
    return (
      <div className="flex-1 overflow-y-auto custom-scrollbar-blue">
        <CreateAcaoForm />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 flex-1 overflow-y-auto custom-scrollbar-blue">
      <div className="grid grid-cols-2 gap-1">
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

      <AcoesList
        acoes={acoesFiltradas}
        onItemClick={(acao) => setActualDetailItem(acao)}
      />
    </div>
  );
}
