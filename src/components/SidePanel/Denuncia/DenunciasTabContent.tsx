import { useAddDenuncia } from '../../../context/AddDenunciaContext';
import { useFilters } from '../../../context/FiltersContext';
import { useOcorrenciasContext } from '../../../context/OcorrenciasContext';
import { AddDenunciaForm } from '../../Forms/AddDenunciaForm';
import { DenunciasList } from './DenunciasList';
import { FilterStatusSelect } from '../Filters/FilterStatusSelect';
import { SelectCategoriaFilter } from '../Filters/SelectCategoriaFilter';
import { useVincularDenunciaContext } from '../../../context/vincularDenunciaContext';
import { VincularAcaoView } from '../Acao/VincularAcaoView';

export function DenunciasTabContent() {
  const { denunciaParaVincular } = useVincularDenunciaContext();
  const { isAddingDenuncia, setIsAddingDenuncia } = useAddDenuncia();
  const { setActualDetailItem } = useOcorrenciasContext();
  const {
    denunciasFiltradas,
    filtroStatusDenuncia,
    setFiltroStatusDenuncia,
    setFiltroCategoria,
  } = useFilters();

  if (denunciaParaVincular) {
    return <VincularAcaoView />;
  }

  if (isAddingDenuncia) {
    return (
      <div className="flex-1 overflow-y-auto custom-scrollbar-blue">
        <AddDenunciaForm onCreateDenuncia={() => setIsAddingDenuncia(false)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
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
