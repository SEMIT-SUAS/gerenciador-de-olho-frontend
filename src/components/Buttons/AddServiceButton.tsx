import { IoIosAdd, IoIosClose } from 'react-icons/io';

type AddServiceButtonProps = {
  label: string;
  isAdding: boolean;
  onClick: () => void;
  className?: string;
};

export function AddServiceButton({
  isAdding,
  onClick,
  label,
  className = '',
}: AddServiceButtonProps) {
  const bgColor = isAdding
    ? 'bg-red-500 hover:bg-red-600'
    : 'bg-gray-50 hover:bg-gray-100';

  const Icon = isAdding ? IoIosClose : IoIosAdd;

  return (
    <button
      onClick={onClick}
      aria-label={isAdding ? `Cancelar ${label}` : `Adicionar ${label}`}
      className={`
        px-3 sm:px-6 py-2 sm:py-3
        ${bgColor}
        text-black
        rounded-lg
        flex items-center gap-2
        text-sm sm:text-base font-medium
        transition-colors
        shadow-sm
        flex-nowrap
        ${className}
      `}
    >
      <Icon size={20} />
      {/* Mostrar texto completo só em telas sm+ */}
      {isAdding ? (
        <span className="hidden sm:inline">Cancelar</span>
      ) : (
        <span className="hidden sm:inline">Adicionar serviço</span>
      )}
    </button>
  );
}
