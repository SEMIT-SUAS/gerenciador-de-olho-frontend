import { useEffect, type ReactNode } from 'react';
import { useAddDenuncia } from '../../context/AddDenunciaContext';
import { useFilters } from '../../context/FiltersContext';
import { useLocation } from 'react-router-dom';
import { TabButtons } from './TabButtons';
import { BackButton } from '../Buttons/Backbutton';
import { useOcorrenciasContext } from '../../context/OcorrenciasContext';

interface SidePanelProps {
  children: ReactNode;
}

export function SidePanel({ children }: SidePanelProps) {
  const { loading } = useOcorrenciasContext();
  const { setNewDenunciaCoordinates, isAddingDenuncia, setIsAddingDenuncia } =
    useAddDenuncia();
  const { denunciasFiltradas, acoesFiltradas } = useFilters();

  useEffect(() => {
    if (!isAddingDenuncia) {
      setNewDenunciaCoordinates(null);
    }
  }, [isAddingDenuncia, setIsAddingDenuncia, setNewDenunciaCoordinates]);

  const location = useLocation();

  const showTabs = ['/ocorrencias/denuncias', '/ocorrencias/acoes'].includes(
    location.pathname,
  );

  if (loading) {
    return <p>Carregando painel...</p>;
  }

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
        </div>

        {showTabs ? (
          <TabButtons
            acoesAmount={acoesFiltradas.length}
            denunciasAmount={denunciasFiltradas.length}
          />
        ) : (
          <BackButton className="ml-3">Retornar à pagina anterior</BackButton>
        )}

        <div className="p-4 overflow-y-auto custom-scrollbar-blue">
          {children}
        </div>
      </aside>
    </>
  );
}
