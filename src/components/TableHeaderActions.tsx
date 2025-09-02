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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
      <div className="relative w-full sm:w-[320px]">
        <SearchInput
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>

      <Button
        className="flex items-center justify-center gap-2 w-full sm:w-auto"
        onClick={onButtonClick}
      >
        <PlusIcon className="h-4 w-4" />
        {buttonText}
      </Button>
    </div>
  );
}
