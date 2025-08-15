import { useFilters } from '../../../../../context/FiltersContext';
import { SecretariaFilter } from './SecretariaFilter';
import { AcaoItem } from './AcaoItem';
import { AcoesListStatusFilter } from './AcoesListStatusFilter';

export function AcoesList() {
  const { acoesFiltradas } = useFilters();

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-1">
        <AcoesListStatusFilter />
        <SecretariaFilter />
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
