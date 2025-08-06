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
  className = ''
}: AddServiceButtonProps) {
  const bgColor = isAdding ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-700 hover:bg-slate-800';
  const Icon = isAdding ? IoIosClose : IoIosAdd;
  
  return (
    <button
      onClick={onClick}
      aria-label={isAdding ? `Cancelar ${label}` : `Adicionar ${label}`}
      className={`
        px-6 py-3
        ${bgColor}
        text-white 
        rounded-lg
        flex items-center gap-2
        text-sm font-medium
        transition-colors
        shadow-sm
        ${className}
      `}
    >
      <Icon size={20} />
      {isAdding ? 'Cancelar' : 'Adicionar serviço'}
    </button>
  );
}
