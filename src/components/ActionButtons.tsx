import { TableCell } from '@/components/ui/table';
import { IconEdit, IconEye, IconEyeOff, IconTrash } from '@tabler/icons-react';

// Definindo as propriedades que o componente aceitará
type ActionButtonsProps = {
  isVisible: boolean;
  onEdit: () => void;
  onToggleVisibility: () => void;
  onDelete: () => void;
};

const buttonStyle =
  'p-1 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors';

export function ActionButtons({
  isVisible,
  onEdit,
  onToggleVisibility,
  onDelete,
}: ActionButtonsProps) {
  return (
    <TableCell className="flex items-center justify-start gap-2">
      <button onClick={onEdit} title="Editar" className={buttonStyle}>
        <IconEdit size={18} />
      </button>

      <button
        onClick={onToggleVisibility}
        title={isVisible ? 'Ocultar' : 'Mostrar'}
        className={buttonStyle}
      >
        {isVisible ? <IconEye size={18} /> : <IconEyeOff size={18} />}
      </button>

      <button
        onClick={onDelete}
        title="Excluir"
        className={`${buttonStyle} hover:text-red-600`}
      >
        <IconTrash size={18} />
      </button>
    </TableCell>
  );
}
