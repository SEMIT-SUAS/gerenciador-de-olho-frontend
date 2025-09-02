import { useAuth } from '@/context/AuthContext';
import { modules } from './constants';
import { Link } from 'react-router-dom';
import { IconCircleFilled } from '@tabler/icons-react';
import { useState } from 'react';

export function DesktopNavItem() {
  const { user, logout } = useAuth();
  // 1. Estado para controlar QUAL menu está aberto (armazenando seu título)
  const [openMenuTitle, setOpenMenuTitle] = useState<string | null>(null);

  return (
    <div className="hidden items-center gap-4 lg:flex">
      <ul className="flex items-center gap-5">
        {modules
          .filter(
            (module) => !module.roles || module.roles.includes(user!.perfil),
          )
          .map((module) => {
            // 3. Verificamos se ESTE é o menu que deve estar aberto
            const isMenuOpen = openMenuTitle === module.title;

            return (
              <li
                key={module.title}
                className="relative" // A classe 'group' não é mais necessária
                // 2. Adicionamos os eventos de mouse AQUI, no <li>, para cobrir o botão e o menu
                onMouseEnter={() => setOpenMenuTitle(module.title)}
                onMouseLeave={() => setOpenMenuTitle(null)}
              >
                {!module.childs || module.childs.length === 0 ? (
                  <Link
                    to={module.to || '#'}
                    className="relative group flex items-center justify-start gap-2 px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-300 hover:justify-center"
                  >
                    <IconCircleFilled
                      size={'6px'}
                      className="text-primary opacity-100 transition-opacity duration-300 group-hover:opacity-0"
                    />
                    <span className="relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:origin-center after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 group-hover:after:scale-x-150">
                      {module.title}
                    </span>
                  </Link>
                ) : (
                  <>
                    <button className="relative flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700">
                      <IconCircleFilled
                        size={'6px'}
                        // 5. O ícone agora some com base no estado 'isMenuOpen'
                        className={`text-primary transition-opacity duration-300 ${
                          isMenuOpen ? 'opacity-0' : 'opacity-100'
                        }`}
                      />
                      <span
                        // A animação da linha também usa o estado
                        className={`relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:origin-center after:bg-primary after:transition-transform after:duration-300 ${
                          isMenuOpen ? 'after:scale-x-100' : 'after:scale-x-0'
                        }`}
                      >
                        {module.title}
                      </span>
                    </button>

                    {/* 4. A visibilidade da <ul> agora depende 100% do estado */}
                    <ul
                      className={`absolute left-0 top-full z-10 w-56 origin-top transform rounded-lg border border-gray-200 bg-white p-2 shadow-lg transition-all duration-200 ${
                        isMenuOpen
                          ? 'scale-100 opacity-100 visible'
                          : 'scale-95 opacity-0 invisible'
                      }`}
                    >
                      {module.childs.map((child) => (
                        <li key={child.to}>
                          <Link
                            to={child.to}
                            className="block w-full rounded-md px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {child.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </li>
            );
          })}
      </ul>
      <Link
        to="/login"
        onClick={() => logout()}
        className="ml-3 inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50"
      >
        <span>Sair</span>
      </Link>
    </div>
  );
}
