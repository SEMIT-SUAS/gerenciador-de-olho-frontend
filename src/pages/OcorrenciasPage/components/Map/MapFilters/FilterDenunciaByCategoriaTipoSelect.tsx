import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFilters } from '@/context/FiltersContext';
import { useOcorrencias } from '@/context/OcorrenciasContext';

export function FilterDenunciaByCategoriaTipoSelect() {
  const { categoriaTipos } = useOcorrencias();
  const { filtroTipoDenuncia, setFiltrarTipoDenuncia, isDisabledFiltersInMap } =
    useFilters();

  return (
    <Select
      onValueChange={(value) => setFiltrarTipoDenuncia(value)}
      value={!filtroTipoDenuncia ? '' : filtroTipoDenuncia}
      disabled={isDisabledFiltersInMap}
    >
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
