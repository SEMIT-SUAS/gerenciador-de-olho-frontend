import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFilters } from '@/context/FiltersContext';
import type { DenunciaStatusModelTypes } from '@/types/Denuncia';

const statusOptions = [
  { text: 'Todos', value: 'all' },
  { text: 'Aberto', value: 'Aberto' },
  { text: 'Análise', value: 'Análise' },
  { text: 'Andamento', value: 'Andamento' },
  { text: 'Indeferidas', value: 'Indeferidas' },
  { text: 'Concluídas', value: 'Concluídas' },
];

export function DenunciasListStatusFilter() {
  const { filtroStatusDenuncia, setFiltroStatusDenuncia } = useFilters();

  function handleOnValueSelected(value: 'all' | DenunciaStatusModelTypes) {
    setFiltroStatusDenuncia(value === 'all' ? 'all' : [value]);
  }

  return (
    <div className="w-full">
      <label
        htmlFor="select-denuncia-status-filter"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Status
      </label>
      <Select
        value={filtroStatusDenuncia === 'all' ? 'all' : filtroStatusDenuncia[0]}
        onValueChange={handleOnValueSelected}
      >
        <SelectTrigger id="select-denuncia-status-filter" className="w-full">
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
