import { useAddDenuncia } from '../../../context/AddDenunciaContext';
import { useFilters } from '../../../context/FiltersContext';
import { useOcorrenciasContext } from '../../../context/ocorrenciasContext';
import { AddDenunciaForm } from '../../Forms/AddDenunciaForm';
import { DenunciasList } from './DenunciasList';
import { FilterStatusSelect } from '../Filters/FilterStatusSelect';
import { SelectCategoriaFilter } from '../Filters/SelectCategoriaFilter';

export function DenunciasTabContent() {
  const { isAddingDenuncia, setIsAddingDenuncia } = useAddDenuncia();
  const { setActualDetailItem } = useOcorrenciasContext();
  const {
    denunciasFiltradas,
    filtroStatusDenuncia,
    setFiltroStatusDenuncia,
    setFiltroCategoria,
  } = useFilters();

  if (isAddingDenuncia) {
    return (
      <div className="flex-1 overflow-y-auto custom-scrollbar-blue">
        <AddDenunciaForm onCreateDenuncia={() => setIsAddingDenuncia(false)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 flex-1 overflow-y-auto custom-scrollbar-blue">
      <div className="grid grid-cols-2 gap-1">
        <FilterStatusSelect
          id="status-filter-select"
          label="Status"
          onStatusChange={(status) => setFiltroStatusDenuncia(status)}
          value={filtroStatusDenuncia}
        />

        <SelectCategoriaFilter
          onCategoriaChange={(categoria) => setFiltroCategoria(categoria)}
        />
      </div>

      <DenunciasList
        denuncias={denunciasFiltradas}
        onItemClick={(denuncia) => setActualDetailItem(denuncia)}
      />
    </div>
  );
}
