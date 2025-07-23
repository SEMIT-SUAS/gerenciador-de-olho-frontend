import { Link } from 'react-router-dom';
import { modules } from './constants';
import { Button } from '../ui/button';

export function Navbar() {
  return (
    <div className="w-full shadow-lg p-5">
      <img src="" alt="" />

      <ul className="flex items-center gap-4">
        {modules.map((module) => {
          if (!module.to && !module.childs) {
            throw new Error('Module must be a to or childs');
          }

          if (module.childs) {
          }

          return (
            <li>
              <Link to={module.to ?? '/'} children={module.title} />
            </li>
          );
        })}

        <Button className="bg-white text-black border-2 border-gray-50 shadow-lg">
          <Link to="/sair">Sair</Link>
        </Button>
      </ul>
    </div>
  );
}
