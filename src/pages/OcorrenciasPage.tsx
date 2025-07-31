import { SidePanel } from '../components/SidePanel/SidePanel';
import { MapComponent } from '../components/Map/MapComponent';
import { Outlet } from 'react-router-dom';
import { FiltersProvider } from '../context/FiltersContext';
import { useOcorrencias } from '../context/OcorrenciasContext';
import { SidePanelSkeleton } from '../components/Loading/SidePanelSkeleton';
import { MapSkeleton } from '../components/Loading/MapSkeleton';
import { MapActionsProvider } from '../context/MapActions';
import { FilesProvider } from '@/context/FilesContext';

export function OcorrenciasPage() {
  const { loading } = useOcorrencias();

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      <FiltersProvider>
        <MapActionsProvider>
          <FilesProvider>
            <SidePanel>
              {loading ? <SidePanelSkeleton /> : <Outlet />}
            </SidePanel>
          </FilesProvider>

          <main className="flex-1 z-10 relative">
            {loading ? <MapSkeleton /> : <MapComponent />}
          </main>
        </MapActionsProvider>
      </FiltersProvider>
    </div>
  );
}
