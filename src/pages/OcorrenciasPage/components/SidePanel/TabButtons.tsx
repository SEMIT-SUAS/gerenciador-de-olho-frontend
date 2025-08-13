import { NavLink, useLocation } from 'react-router-dom';

interface TabButtonsProps {
  denunciasAmount: number;
  acoesAmount: number;
}

export function TabButtons({ denunciasAmount, acoesAmount }: TabButtonsProps) {
  const location = useLocation();

  const activeTabIndex = location.pathname.includes('/ocorrencias/acoes')
    ? 1
    : 0;

  const baseStyle =
    'flex-1 py-3 px-2 text-center font-semibold transition-colors duration-300 z-10';
  const activeTextStyle = 'text-blue-600';
  const inactiveTextStyle = 'text-gray-500 hover:text-gray-700';

  return (
    <div className="relative flex w-full">
      <div
        className="absolute bottom-[-2px] h-1 w-1/2 transition-all duration-300 ease-in-out"
        style={{
          transform: `translateX(${activeTabIndex * 100}%)`,
        }}
      >
        <div className="mx-auto h-1 w-1/2 rounded-full bg-blue-500" />
      </div>

      <NavLink
        to="/ocorrencias/denuncias"
        className={`${baseStyle} ${
          activeTabIndex === 0 ? activeTextStyle : inactiveTextStyle
        }`}
      >
        Denúncias
      </NavLink>
      <NavLink
        to="/ocorrencias/acoes"
        className={`${baseStyle} ${
          activeTabIndex === 1 ? activeTextStyle : inactiveTextStyle
        }`}
      >
        Ações
      </NavLink>
    </div>
  );
}
