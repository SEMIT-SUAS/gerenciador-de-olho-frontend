import { type ReactNode } from 'react';
import { useFilters } from '../../context/FiltersContext';
import { useLocation } from 'react-router-dom';
import { TabButtons } from './TabButtons';
import { useOcorrencias } from '../../context/OcorrenciasContext';
import { AddButton } from '../Buttons/AddButton';
import { Separator } from '@/components/ui/separator';

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
    <aside className="w-full md:w-[450px] shadow-lg flex flex-col flex-shrink-0 overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Painel de Ocorrências
          </h1>

          <span className="text-blue-500 text-md font-bold">
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
      <div className="flex items-center justify-between mx-5">
        <Separator />
      </div>
      <div className="overflow-y-auto custom-scrollbar-blue">
        <div className="p-4">{children}</div>
      </div>
    </aside>
  );
}
