import { IoIosAdd, IoIosClose } from 'react-icons/io';

type AddButtonProps = {
  label: string;
  isAdding: boolean;
  onClick: () => void;

};

export function AddButton({ isAdding, onClick, label }: AddButtonProps) {
  const bgColor = isAdding ? 'bg-red-600' : 'bg-blue-600';

  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`p-1 rounded-full ${bgColor} cursor-pointer`}
    >
      {isAdding ? (
        <IoIosClose size={36} color="white" />
      ) : (
        <IoIosAdd size={36} color="white" />
      )}
    </button>
  );
}
