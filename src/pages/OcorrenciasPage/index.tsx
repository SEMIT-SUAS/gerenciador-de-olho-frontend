import { MapLoading } from '@/components/Loading/MapLoading';
import { useOcorrencias } from '@/context/OcorrenciasContext';
import { OcorrenciasMap } from './components/Map/OcorrenciasMap';
import { SidePanel } from './components/SidePanel';
import { Outlet, useOutlet } from 'react-router-dom';

export function OcorrenciasPage() {
  const { isLoadingInitialContent } = useOcorrencias();
  const outletContent = useOutlet();

  return (
    <div className="h-screen w-full relative">
      {outletContent && (
        <SidePanel>
          <Outlet />
        </SidePanel>
      )}
      {isLoadingInitialContent ? <MapLoading /> : <OcorrenciasMap />}
    </div>
  );
}
