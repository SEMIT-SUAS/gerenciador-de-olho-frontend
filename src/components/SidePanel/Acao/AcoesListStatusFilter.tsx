import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFilters } from '@/context/FiltersContext';
import type { AcaoStatusModelTypes } from '@/types/AcaoStatus';

const statusOptions = [
  { text: 'Todas', value: 'all' },
  { text: 'Análise', value: 'Análise' },
  { text: 'Andamento', value: 'Andamento' },
  { text: 'Indeferidas', value: 'Indeferido' },
  { text: 'Concluídas', value: 'Concluído' },
];

export function AcoesListStatusFilter() {
  const { setFiltroStatusAcao, filtroStatusAcao } = useFilters();

  function handleOnValueSelected(value: AcaoStatusModelTypes | 'all') {
    setFiltroStatusAcao(value === 'all' ? 'all' : [value]);
  }

  return (
    <div className="w-full">
      <label
        htmlFor={'select-acao-status-filter'}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Status
      </label>

      <Select
        value={filtroStatusAcao === 'all' ? 'all' : filtroStatusAcao[0]}
        onValueChange={handleOnValueSelected}
      >
        <SelectTrigger id="select-acao-status-filter" className="w-full">
          <SelectValue placeholder="Selecione um status..." />
        </SelectTrigger>

        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
