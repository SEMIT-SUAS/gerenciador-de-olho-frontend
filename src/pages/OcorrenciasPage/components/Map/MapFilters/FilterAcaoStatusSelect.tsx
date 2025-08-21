import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFilters } from '@/context/FiltersContext';
import { set } from 'zod/v4';

const avaliableStatus = [
  {
    name: 'Análise',
    value: 'Análise',
  },
  {
    name: 'Andamento',
    value: 'Andamento',
  },
  {
    name: 'Indeferida',
    value: 'Indeferido',
  },
  {
    name: 'Concluído',
    value: 'Concluído',
  },
];

export function FilterAcaoStatusSelect() {
  const { setFiltroStatusAcao } = useFilters();

  return (
    <Select onValueChange={(value) => setFiltroStatusAcao(value)}>
      <SelectTrigger className="w-full bg-white">
        <SelectValue placeholder="Status da ação" />
      </SelectTrigger>

      <SelectContent>
        {avaliableStatus.map((status, idx) => (
          <SelectItem key={idx} value={status.value}>
            {status.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
