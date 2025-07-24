import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useOcorrencias } from '@/context/OcorrenciasContext';

type SelectCategoriaFilterProps = {
  onCategoriaChange: (categoria: string) => void;
};

export function SelectCategoriaFilter({
  onCategoriaChange,
}: SelectCategoriaFilterProps) {
  const { categorias } = useOcorrencias();

  return (
    <div>
      <label
        htmlFor="categoria-select"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Categoria
      </label>

      <Select
        onValueChange={onCategoriaChange}
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
