import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFilters } from '@/context/FiltersContext';
import { useOcorrencias } from '@/context/OcorrenciasContext';

export function DenunciasListCategoriaFilter() {
  const { categorias } = useOcorrencias();
  const { setFiltroCategoria } = useFilters();

  function handleOnValueSelected(value: string) {
    setFiltroCategoria(value);
  }

  return (
    <div>
      <label
        htmlFor="categoria-select"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Categoria
      </label>

      <Select
        onValueChange={handleOnValueSelected}
        defaultValue="todas"
        disabled={!categorias}
      >
        <SelectTrigger id="categoria-select" className="w-full">
          <SelectValue placeholder="Selecione uma categoria..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todas</SelectItem>
          {categorias?.map((categoria) => (
            <SelectItem key={categoria.id} value={categoria.nome}>
              {categoria.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
