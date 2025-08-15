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
  { text: 'Todos', value: 'todos' },
  { text: 'Aberto', value: 'aberto' },
  { text: 'Em analise', value: 'em_analise' },
  { text: 'Em andamento', value: 'em_andamento' },
  { text: 'Indeferidas', value: 'indeferido' },
  { text: 'Concluídas', value: 'concluido' },
];

export function DenunciasListStatusFilter() {
  const { filtroStatusDenuncia, setFiltroStatusDenuncia } = useFilters();

  function handleOnValueSelected(value: DenunciaStatusModelTypes | 'todos') {
    setFiltroStatusDenuncia(value === 'todos' ? 'todos' : [value]);
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
        value={
          filtroStatusDenuncia === 'todos' ? 'todos' : filtroStatusDenuncia[0]
        }
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
