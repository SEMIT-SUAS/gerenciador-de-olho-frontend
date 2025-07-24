import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useOcorrencias } from '@/context/OcorrenciasContext';

type SelectSecretariaFilterProps = {
  onSecretariaChange: (secretaria: string) => void;
};

export function SelectSecretariaFilter({
  onSecretariaChange,
}: SelectSecretariaFilterProps) {
  const { secretarias } = useOcorrencias();

  function handleOnSelect(event: any) {
    onSecretariaChange(event.target.value);
  }

  return (
    <div>
      <label
        htmlFor="secretaria-select"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Secretaria
      </label>

      <Select defaultValue="todas" disabled={!secretarias}>
        <SelectTrigger id="secretaria-select" className="w-full">
          <SelectValue placeholder="Selecione uma secretaria..." />
        </SelectTrigger>

        <SelectContent onChange={handleOnSelect}>
          <SelectItem value="todas">Todas</SelectItem>

          {secretarias.map((sec) => (
            <SelectItem key={sec.id} value={sec.nome}>
              {sec.sigla}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
