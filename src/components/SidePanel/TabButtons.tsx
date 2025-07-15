import { NavLink } from 'react-router-dom';

interface TabButtonsProps {
  denunciasAmount: number;
  acoesAmount: number;
}

export function TabButtons({ denunciasAmount, acoesAmount }: TabButtonsProps) {
  const baseStyle =
    'flex-1 py-3 px-2 text-center font-semibold border-b-4 transition-colors duration-200';
  const activeStyle = 'border-blue-500 text-blue-600';
  const inactiveStyle =
    'border-transparent text-gray-500 hover:border-gray-300';

  return (
    <div className="flex w-full border-b-2 border-gray-200">
      <NavLink
        to="/ocorrencias/denuncias"
        className={({ isActive }) =>
          `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
        }
      >
        Denúncias ({denunciasAmount})
      </NavLink>
      <NavLink
        to="/ocorrencias/acoes"
        className={({ isActive }) =>
          `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
        }
      >
        Ações ({acoesAmount})
      </NavLink>
    </div>
  );
}
