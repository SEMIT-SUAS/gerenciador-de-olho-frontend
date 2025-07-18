import { DenunciaItem } from './DenunciaItem';
import { useFilters } from '../../../context/FiltersContext';
import { useNavigate } from 'react-router-dom';
import { FilterStatusSelect } from '../Filters/FilterStatusSelect';
import { SelectCategoriaFilter } from '../Filters/SelectCategoriaFilter';
import { Button } from '@/components/Buttons/Button';

export function DenunciasList() {
  const {
    denunciasFiltradas: denuncias,
    setFiltroStatusDenuncia,
    filtroStatusDenuncia,
    setFiltroCategoria,
  } = useFilters();


  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-1">
        <FilterStatusSelect
          id="status-filter-select"
          label="Status"
          onStatusChange={(status) =>
            setFiltroStatusDenuncia(status == 'todos' ? 'todos' : [status])
          }
          value={
            filtroStatusDenuncia == 'todos' ? 'todos' : filtroStatusDenuncia[0]
          }
        />  

        <SelectCategoriaFilter
          onCategoriaChange={(categoria) => setFiltroCategoria(categoria)}
        />
      </div>

      {denuncias.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">
          Nenhuma denúncia encontrada.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {denuncias.map((denuncia) => {
            return (
              <DenunciaItem
                key={denuncia.id}
                denuncia={denuncia}
                onClick={() =>
                  navigate(`/ocorrencias/denuncias/${denuncia.id}`)
                }
                showTag={true}
                showDescription={true}
                isDeletable={false}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
