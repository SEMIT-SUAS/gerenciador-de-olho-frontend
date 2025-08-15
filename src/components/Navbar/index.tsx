import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { modules } from './constants';
import { IconCircleFilled, IconLogout } from '@tabler/icons-react';
import { Menu, X } from 'lucide-react'; // Ícones para o botão hambúrguer
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { Button } from '../ui/button';
import { Separator } from '@radix-ui/react-select';
import type { Module } from './types';

export function Navbar() {
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
    <nav className="relative w-full border-b border-gray-200 bg-white px-4 py-4 md:px-20">
      <div className="mx-auto flex w-full items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src="/saoluis-prefeitura.png" alt="Logo SLZ" className="h-12" />
        </Link>

        <div className="hidden items-center gap-4 lg:flex">
          <ul className="flex items-center gap-5">
            {modules.map((module) => (
              <li key={module.title} className="group relative">
                {!module.childs || module.childs.length === 0 ? (
                  <Link
                    to={module.to || '#'}
                    className="relative flex items-center justify-start gap-2 px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-300 group-hover:justify-center"
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
                        className="text-primary opacity-100 transition-opacity duration-300 group-hover:opacity-0"
                      />
                      <span className="relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:origin-center after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 group-hover:after:scale-x-100">
                        {module.title}
                      </span>
                    </button>
                    <ul className="absolute left-0 top-full z-10 mt-2 w-56 origin-top scale-95 transform rounded-lg border border-gray-200 bg-white p-2 shadow-lg opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 group-hover:visible">
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
            ))}
          </ul>
          <Link
            to="/sair"
            className="ml-3 inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50"
          >
            <span>Sair</span>
          </Link>
        </div>

        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Abrir menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col p-4">
              <div className="mb-4 border-b pb-4">
                <NavLink to="/" className="flex items-center gap-3">
                  <img
                    src="/saoluis-prefeitura.png"
                    alt="Logo SLZ"
                    className="h-10"
                  />
                </NavLink>
              </div>

              <div className="flex-1">
                <nav className="grid items-start gap-1 text-md text-gray-700">
                  {modules.map((module) =>
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
                    to="/sair"
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
      </div>
    </nav>
  );
}
