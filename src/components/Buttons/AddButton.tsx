import { IoIosAdd, IoIosClose } from 'react-icons/io';

type AddButtonProps = {
  label: string;
  isAdding: boolean;
  disabled: boolean;
  onClick: () => void;
};

export function AddButton({
  isAdding,
  onClick,
  label,
  disabled,
}: AddButtonProps) {
  const bgColor = isAdding ? 'bg-red-600' : 'bg-blue-600';

  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`p-1 rounded-full ${bgColor} cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
      disabled={disabled}
    >
      {isAdding ? (
        <IoIosClose size={36} color="white" />
      ) : (
        <IoIosAdd size={36} color="white" />
      )}
    </button>
  );
}
