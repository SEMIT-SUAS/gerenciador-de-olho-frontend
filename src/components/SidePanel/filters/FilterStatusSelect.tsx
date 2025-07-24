import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { AcaoStatusModelTypes } from '@/types/AcaoStatus';
import type { DenunciaStatusModelTypes } from '@/types/Denuncia';

const statusOptions = [
  { text: 'Todos', value: 'todos' },
  { text: 'Aberto', value: 'aberto' },
  { text: 'Em analise', value: 'em_analise' },
  { text: 'Em andamento', value: 'em_andamento' },
  { text: 'Indeferidas', value: 'indeferido' },
  { text: 'Concluídas', value: 'concluido' },
];

type FilterStatusSelectProps = {
  id: string;
  label: string;
  value: string;
  onStatusChange: (
    status: 'todos' | AcaoStatusModelTypes | DenunciaStatusModelTypes,
  ) => void;
};

export function FilterStatusSelect({
  id,
  label,
  value,
  onStatusChange,
}: FilterStatusSelectProps) {
  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <Select value={value} onValueChange={onStatusChange}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder="Selecione um status..." />
        </SelectTrigger>

        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
