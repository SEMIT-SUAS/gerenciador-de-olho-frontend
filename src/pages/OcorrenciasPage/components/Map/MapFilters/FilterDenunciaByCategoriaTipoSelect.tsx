import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useOcorrencias } from '@/context/OcorrenciasContext';

export function FilterDenunciaByCategoriaTipoSelect({
  value,
  onValueChange,
}: {
  value: string | null; // <-- Adicione a tipagem
  onValueChange: (value: string) => void;
}) {
  const { categoriaTipos } = useOcorrencias();

  return (
    <Select onValueChange={onValueChange} value={value ?? ''}>
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
