import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFilters } from '@/context/FiltersContext';
import { useOcorrencias } from '@/context/OcorrenciasContext';

export function FilterAcaoSecretariaSelect() {
  const { secretarias } = useOcorrencias();
  const { setFiltroSecretaria } = useFilters();

  return (
    <Select onValueChange={(value) => setFiltroSecretaria(value)}>
      <SelectTrigger className="w-full bg-white">
        <SelectValue placeholder="Secretaria da ação" />
      </SelectTrigger>

      <SelectContent>
        {secretarias.map((sc) => (
          <SelectItem key={sc.id} value={sc.sigla}>
            {sc.sigla}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
