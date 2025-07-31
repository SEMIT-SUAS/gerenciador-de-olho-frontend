import { FaChevronDown } from 'react-icons/fa';

export function SelectArrowDown() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
      <FaChevronDown size={20} color="#99a1af" />
    </div>
  );
}
