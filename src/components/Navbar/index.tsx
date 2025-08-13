import { Link } from 'react-router-dom';
import { modules } from './constants';
import { IconCircleFilled } from '@tabler/icons-react';

export function Navbar() {
  return (
    <nav className="w-full bg-white flex py-4 px-4 md:px-20 justify-between items-center border-b border-gray-200">
      <Link to="/" className="flex items-center">
        <img
          src="../public/saoluis-prefeitura.png"
          alt="Logo SLZ"
          className="h-12 md:h-12"
        />
      </Link>

      <div className="flex gap-4 items-center">
        <ul className="flex items-center gap-5">
          {modules.map((module) => (
            <li key={module.title} className="relative group">
              {!module.childs || module.childs.length === 0 ? (
                <Link
                  to={module.to || '#'}
                  className="relative flex items-center justify-start group-hover:justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-300"
                >
                  <IconCircleFilled
                    size={'6px'}
                    className="text-primary opacity-100 group-hover:opacity-0 transition-opacity duration-300"
                  />
                  <span className="relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-full after:bg-primary after:scale-x-0 group-hover:after:scale-x-150 after:transition-transform after:duration-300 after:origin-center">
                    {module.title}
                  </span>
                </Link>
              ) : (
                <>
                  <button className="relative flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700">
                    <IconCircleFilled
                      size={'6px'}
                      className="text-primary opacity-100 group-hover:opacity-0 transition-opacity duration-300"
                    />
                    <span className="relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-full after:bg-primary after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-center">
                      {module.title}
                    </span>
                  </button>
                  <ul className="absolute left-0 top-full mt-2 w-56 p-2 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform scale-95 group-hover:scale-100 origin-top z-10">
                    {module.childs.map((child) => (
                      <li key={child.to}>
                        <Link
                          to={child.to}
                          className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md text-left"
                        >
                          {child.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </li>
          ))}
        </ul>

        <Link
          to="/sair"
          className="inline-flex items-center justify-center ml-3 gap-2 px-6 py-2 text-sm font-medium text-gray-800 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          {/* <IconDoorExit size={16} /> */}
          <span>Sair</span>
        </Link>
      </div>
    </nav>
  );
}
