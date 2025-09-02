import { NavLink } from 'react-router-dom';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui/sheet';
import type { Module } from './types';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';
import { modules } from './constants';
import { useAuth } from '@/context/AuthContext';
import { Separator } from '../ui/separator';
import { IconLogout } from '@tabler/icons-react';

export function MobileNavItem() {
  const { user, logout } = useAuth();

  const renderMobileLink = (module: Module) => (
    <SheetClose asChild key={module.title}>
      <NavLink
        to={module.to || '#'}
        // A mágica do NavLink: a classe muda se o link está ativo
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted ${
            isActive
              ? 'bg-muted text-primary' // Estilo ATIVO
              : 'text-muted-foreground' // Estilo NORMAL
          }`
        }
      >
        {module.title}
      </NavLink>
    </SheetClose>
  );

  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Abrir menu">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="flex flex-col p-4">
          <div className="mb-4 border-b pb-4">
            <NavLink to="/dashboard" className="flex items-center gap-3">
              <img
                src="/saoluis-prefeitura.png"
                alt="Logo SLZ"
                className="h-8 sm:h-10"
              />
            </NavLink>
          </div>

          <div className="flex-1">
            <nav className="grid items-start gap-1 text-md text-gray-700">
              {modules
                .filter(
                  (module) =>
                    !module.roles || module.roles.includes(user!.perfil),
                )
                .map((module) =>
                  !module.childs || module.childs.length === 0 ? (
                    renderMobileLink(module)
                  ) : (
                    <div key={module.title} className="text-gray-700">
                      <div className="flex items-center gap-3 px-3 py-2">
                        <span className="text-md">{module.title}</span>
                      </div>
                      <div className="ml-5 flex flex-col border-l pl-3">
                        {module.childs.map((child) =>
                          renderMobileLink({ ...child }),
                        )}
                      </div>
                    </div>
                  ),
                )}
            </nav>
          </div>

          <div className="mt-auto">
            <Separator className="my-4" />
            <SheetClose asChild>
              <NavLink
                to="/login"
                onClick={() => logout()}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted"
              >
                <IconLogout className="h-5 w-5" />
                Sair
              </NavLink>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
