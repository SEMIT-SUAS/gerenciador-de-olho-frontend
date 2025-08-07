import { Link } from 'react-router-dom';
import { modules } from './constants';
import { Button } from '../ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu';

export function Navbar() {
  return (
    <div className="w-full flex py-5 px-20 justify-between items-center border-b">
      <img src="logo_slz_sem_fundo.png" alt="Logo slz" className="h-16" />

      <div className="flex items-center gap-8">
        <NavigationMenu>
          <NavigationMenuList>
            {modules.map((module) =>
              module.childs ? (
                <NavigationMenuItem key={module.title}>
                  <NavigationMenuTrigger>{module.title}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="flex flex-col w-[200px]">
                      {module.childs.map((child) => (
                        <Link
                          key={child.title}
                          to={child.to!}
                          className="p-2 rounded-md hover:bg-accent text-sm"
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={module.title}>
                  <Link to={module.to ?? '/'}>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      {module.title}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ),
            )}
          </NavigationMenuList>

          <NavigationMenuViewport />
        </NavigationMenu>

        <Button variant={'outline'} asChild>
          <Link to="/sair">Sair</Link>
        </Button>
      </div>
    </div>
  );
}
