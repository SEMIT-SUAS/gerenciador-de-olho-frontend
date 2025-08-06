import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFilters } from '@/context/FiltersContext';
import { useOcorrencias } from '@/context/OcorrenciasContext';

export function SecretariaFilter() {
  const { setFiltroSecretaria } = useFilters();
  const { secretarias } = useOcorrencias();

  function handleOnSelect(value: string) {
    setFiltroSecretaria(value);
  }

  return (
    <div>
      <label
        htmlFor="secretaria-select"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Secretaria
      </label>

      <Select
        defaultValue="todas"
        disabled={!secretarias}
        onValueChange={handleOnSelect}
      >
        <SelectTrigger id="secretaria-select" className="w-full">
          <SelectValue placeholder="Selecione uma secretaria..." />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="todas">Todas</SelectItem>

          {secretarias.map((sec) => (
            <SelectItem key={sec.id} value={sec.sigla}>
              {sec.sigla}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
