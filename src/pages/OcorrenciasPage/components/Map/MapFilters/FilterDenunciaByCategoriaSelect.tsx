import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useOcorrencias } from '@/context/OcorrenciasContext';

export function FilterDenunciaByCategoriaSelect() {
  const { categorias } = useOcorrencias();

  return (
    <Select>
      <SelectTrigger className="w-full bg-white">
        <SelectValue placeholder="Categoria da denúncia" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="default">Categoria da denúncia</SelectItem>
        {categorias.map((categoria) => (
          <SelectItem key={categoria.id} value={categoria.nome}>
            {categoria.nome}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
