import { Button } from './ui/button';
import { SearchInput } from '@/components/ui/input';
import { PlusIcon } from 'lucide-react';

type TableHeaderActionsProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;

  buttonText: string;
  onButtonClick: () => void;
};

export function TableHeaderActions({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Pesquise pelo nome', // Valor padrão para o placeholder
  buttonText,
  onButtonClick,
}: TableHeaderActionsProps) {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="relative w-[320px]">
        <SearchInput
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>

      <Button className="flex items-center gap-2" onClick={onButtonClick}>
        <PlusIcon className="h-4 w-4" />
        {buttonText}
      </Button>
    </div>
  );
}
