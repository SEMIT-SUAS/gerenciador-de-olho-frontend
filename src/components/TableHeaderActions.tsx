import { Button } from './ui/button';
import { SearchInput } from '@/components/ui/input';
import { PlusIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ChangeEvent } from 'react';

type TableHeaderActionsProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  buttonText: string;
  onButtonClick?: () => void; // agora OPCIONAL
  buttonTo?: string; // novo OPCIONAL
};

export function TableHeaderActions({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Pesquise pelo nome',
  buttonText,
  onButtonClick,
  buttonTo,
}: TableHeaderActionsProps) {
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const ButtonInner = (
    <>
      <PlusIcon className="h-4 w-4" />
      {buttonText}
    </>
  );

  // PRIORIDADE:
  // 1) Se onButtonClick vier -> usa onClick (para abrir modal)
  // 2) Senão, se buttonTo vier -> usa Link
  // 3) Senão, renderiza botão desabilitado (evita onClick undefined)
  const action =
    onButtonClick != null ? (
      <Button
        className="flex items-center justify-center gap-2 w-full sm:w-auto"
        onClick={onButtonClick}
      >
        {ButtonInner}
      </Button>
    ) : buttonTo ? (
      <Button
        asChild
        className="flex items-center justify-center gap-2 w-full sm:w-auto"
      >
        <Link to={buttonTo}>{ButtonInner}</Link>
      </Button>
    ) : (
      <Button
        className="flex items-center justify-center gap-2 w-full sm:w-auto"
        disabled
        title="Ação indisponível"
      >
        {ButtonInner}
      </Button>
    );

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
      <div className="relative w-full sm:w-[320px]">
        <SearchInput
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>

      {action}
    </div>
  );
}
