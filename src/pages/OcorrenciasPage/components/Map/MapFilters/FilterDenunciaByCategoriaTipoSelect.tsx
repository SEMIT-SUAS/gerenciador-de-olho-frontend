import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFilters } from '@/context/FiltersContext';
import { useOcorrencias } from '@/context/OcorrenciasContext';

export function FilterDenunciaByCategoriaTipoSelect({
  onValueChange,
}: {
  onValueChange: (value: string) => void;
}) {
  const { categoriaTipos } = useOcorrencias();

  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger className="w-full bg-white">
        <SelectValue placeholder="Tipo de denúncia" />
      </SelectTrigger>

      <SelectContent>
        {categoriaTipos.map((tipo) => (
          <SelectItem key={tipo.id} value={tipo.nome}>
            {tipo.nome}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
