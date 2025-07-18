import { IoIosAdd, IoIosClose } from 'react-icons/io';
import { useLocation } from 'react-router-dom';

export function AddButton() {
  const location = useLocation();
  const isAdding = location.pathname.endsWith('/add');

  const bgColor = isAdding ? 'bg-red-600' : 'bg-blue-600';

  function handleOnClickButton() {}

  return (
    <button
      onClick={handleOnClickButton}
      aria-label={isAdding ? '' : ''}
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
