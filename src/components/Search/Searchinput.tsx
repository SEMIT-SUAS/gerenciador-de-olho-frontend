import { forwardRef } from 'react';

type SearchInputProps = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
};

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(({
  placeholder = "Pesquise um serviço",
  value,
  onChange,
  className = ''
}, ref) => {
  return (
    <div className={`relative flex-1 ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        {/* Espaço reservado para o ícone do Figma */}
        <div className="w-5 h-5 text-gray-400">
          {/* Aqui você pode importar e usar o ícone do Figma */}
          {/* Exemplo: <FigmaSearchIcon className="w-5 h-5" /> */}
        </div>
      </div>
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="
          w-full
          pl-12 pr-4 py-3
          bg-white
          border border-gray-200
          rounded-lg
          text-sm
          placeholder-gray-400
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          focus:border-transparent
          transition-all
        "
      />
    </div>
  );
});

SearchInput.displayName = 'SearchInput';
