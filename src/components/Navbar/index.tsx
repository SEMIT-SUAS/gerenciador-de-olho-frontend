import { Link } from 'react-router-dom';
import { DesktopNavItem } from './DesktopNavItem';
import { MobileNavItem } from './MobileNavItem';

export function Navbar() {
  return (
    <nav className="relative w-full border-b border-gray-200 bg-white px-3 py-3 sm:px-4 sm:py-4 md:px-8 lg:px-12 xl:px-20">
      <div className="mx-auto flex w-full items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src="/saoluis-prefeitura.png" alt="Logo SLZ" className="h-12" />
        </Link>

        <DesktopNavItem />
        <MobileNavItem />
      </div>
    </nav>
  );
}
