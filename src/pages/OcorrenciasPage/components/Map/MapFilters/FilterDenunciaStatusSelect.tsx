import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFilters } from '@/context/FiltersContext';
import type { DenunciaStatusModelTypes } from '@/types/Denuncia';

const avaliableStatus = [
  {
    name: 'Aberto',
    value: 'Aberto',
  },
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
    name: 'Concluída',
    value: 'Concluída',
  },
];

export function FilterDenunciaStatusSelect() {
  const {
    setFiltroStatusDenuncia,
    filtroStatusDenuncia,
    isDisabledFiltersInMap,
  } = useFilters();

  return (
    <Select
      onValueChange={(value: DenunciaStatusModelTypes) =>
        setFiltroStatusDenuncia(value)
      }
      defaultValue="Aberto"
      value={filtroStatusDenuncia}
      disabled={isDisabledFiltersInMap}
    >
      <SelectTrigger className="w-full bg-white">
        <SelectValue placeholder="Status da denúncia" />
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
