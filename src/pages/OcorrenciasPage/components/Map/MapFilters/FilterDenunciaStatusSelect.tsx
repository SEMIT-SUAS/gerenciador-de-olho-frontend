import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFilters } from '@/context/FiltersContext';

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
  const { setFiltroStatusDenuncia, filtroStatusDenuncia } = useFilters();

  return (
    <Select
      onValueChange={(value) => setFiltroStatusDenuncia(value)}
      defaultValue="Aberto"
      value={filtroStatusDenuncia}
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
