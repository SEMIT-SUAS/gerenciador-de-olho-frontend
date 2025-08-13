import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFilters } from '@/context/FiltersContext';
import { useOcorrencias } from '@/context/OcorrenciasContext';

export function DenunciasListCategoriaTipoFilter() {
  const { categoriaTipos } = useOcorrencias();
  const { setFiltroCategoriaTipo } = useFilters();

  function handleOnValueSelected(value: string) {
    setFiltroCategoriaTipo(value);
  }

  return (
    <div>
      <label
        htmlFor="tipo-select"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Tipos
      </label>

      <Select
        onValueChange={handleOnValueSelected}
        defaultValue="all"
        disabled={!categoriaTipos}
      >
        <SelectTrigger id="tipo-select" className="w-full">
          <SelectValue placeholder="Selecione um tipo..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {categoriaTipos?.map((tipo) => (
            <SelectItem key={tipo.id} value={tipo.nome}>
              {tipo.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
