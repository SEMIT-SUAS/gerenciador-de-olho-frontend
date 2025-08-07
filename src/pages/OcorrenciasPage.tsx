import { SidePanel } from '../components/SidePanel';
import { MapComponent } from '../components/Map/MapComponent';
import { Outlet } from 'react-router-dom';
import { FiltersProvider } from '../context/FiltersContext';
import { useOcorrencias } from '../context/OcorrenciasContext';
import { MapActionsProvider } from '../context/MapActions';
import { FilesProvider } from '@/context/FilesContext';
import { SidePanelLoadingContent } from '@/components/Loading/SidePanelLoadingContent';
import { MapLoading } from '@/components/Loading/MapLoading';

export function OcorrenciasPage() {
  const { loading } = useOcorrencias();

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      <FiltersProvider>
        <MapActionsProvider>
          <FilesProvider>
            <SidePanel>
              {loading ? <SidePanelLoadingContent /> : <Outlet />}
            </SidePanel>
          </FilesProvider>

          <main className="flex-1 z-10 relative">
            {loading ? <MapLoading /> : <MapComponent />}
          </main>
        </MapActionsProvider>
      </FiltersProvider>
    </div>
  );
}
