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
  { text: 'Todos', value: 'todos' },
  { text: 'Em analise', value: 'em_analise' },
  { text: 'Em andamento', value: 'em_andamento' },
  { text: 'Indeferidas', value: 'indeferido' },
  { text: 'Concluídas', value: 'concluido' },
];

export function AcoesListStatusFilter() {
  const { setFiltroStatusAcao, filtroStatusAcao } = useFilters();

  function handleOnValueSelected(value: AcaoStatusModelTypes | 'todos') {
    setFiltroStatusAcao(value === 'todos' ? 'todos' : [value]);
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
        value={filtroStatusAcao === 'todos' ? 'todos' : filtroStatusAcao[0]}
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
