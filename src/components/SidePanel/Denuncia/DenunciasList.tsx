import { DenunciaItem } from './DenunciaItem';
import { useFilters } from '@/context/FiltersContext';
import { useNavigate } from 'react-router-dom';
import { DenunciasListStatusFilter } from './DenunciasListStatusFilter';
import { DenunciasListCategoriaFilter } from './DenunciasListCategoriaFilter';

export function DenunciasList() {
  const { denunciasFiltradas: denuncias } = useFilters();

  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-1">
        <DenunciasListStatusFilter />
        <DenunciasListCategoriaFilter />
      </div>

      {denuncias.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">
          Nenhuma denúncia encontrada.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {[...denuncias]
            .sort(
              (a, b) =>
                new Date(b.criadaEm).getTime() - new Date(a.criadaEm).getTime(),
            )
            .map((denuncia) => {
              return (
                <DenunciaItem
                  showDate={true}
                  key={denuncia.id}
                  denuncia={denuncia}
                  onClick={() =>
                    navigate(`/ocorrencias/denuncias/${denuncia.id}`)
                  }
                  showTag={true}
                  isDeletable={false}
                />
              );
            })}
        </div>
      )}
    </div>
  );
}
