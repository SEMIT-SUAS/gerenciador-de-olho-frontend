import { type ReactNode } from 'react';
import { useFilters } from '../../context/FiltersContext';
import { useLocation } from 'react-router-dom';
import { TabButtons } from './TabButtons';
import { useOcorrencias } from '../../context/OcorrenciasContext';
import { AddButton } from '../Buttons/AddButton';

interface SidePanelProps {
  children: ReactNode;
}

export function SidePanel({ children }: SidePanelProps) {
  const { denunciasFiltradas, acoesFiltradas } = useFilters();
  const { loading } = useOcorrencias();
  const location = useLocation();

  const showTabs = ['/ocorrencias/denuncias', '/ocorrencias/acoes'].includes(
    location.pathname,
  );

  return (
    <>
      <aside className="w-full md:w-[450px] bg-white shadow-lg flex flex-col z-20 h-screen">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Painel de Ocorrências
            </h1>

            <span className="text-blue-500 text-sm font-semibold">
              De olho na cidade
            </span>
          </div>

          <AddButton />
        </div>

        {!loading && showTabs && (
          <TabButtons
            acoesAmount={acoesFiltradas.length}
            denunciasAmount={denunciasFiltradas.length}
          />
        )}

        <div className="p-4 overflow-y-auto custom-scrollbar-blue">
          {children}
        </div>
      </aside>
    </>
  );
}
