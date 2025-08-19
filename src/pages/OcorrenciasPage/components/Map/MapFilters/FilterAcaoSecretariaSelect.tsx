import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useOcorrencias } from '@/context/OcorrenciasContext';

export function FilterAcaoSecretariaSelect() {
  const { secretarias } = useOcorrencias();

  return (
    <Select>
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
