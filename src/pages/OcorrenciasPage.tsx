import { SidePanel } from '../components/SidePanel/SidePanel';
import { MapComponent } from '../components/Map/MapComponent';
import { AddDenunciaProvider } from '../context/AddDenunciaContext';
import { AddAcaoProvider } from '../context/AddAcaoContext';
import { Outlet } from 'react-router-dom';
import { FiltersProvider } from '../context/FiltersContext';
import { useOcorrencias } from '../context/OcorrenciasContext';
import { SidePanelSkeleton } from '../components/Loading/SidePanelSkeleton';
import { MapSkeleton } from '../components/Loading/MapSkeleton';
import { MapActionsProvider } from '../context/MapActions';

export function OcorrenciasPage() {
  const { loading } = useOcorrencias();

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <FiltersProvider>
        <MapActionsProvider>
          <AddDenunciaProvider>
            <AddAcaoProvider>
              <SidePanel>
                {loading ? <SidePanelSkeleton /> : <Outlet />}
              </SidePanel>

              <main className="flex-1 z-10 relative">
                {loading ? <MapSkeleton /> : <MapComponent />}
              </main>
            </AddAcaoProvider>
          </AddDenunciaProvider>
        </MapActionsProvider>
      </FiltersProvider>
    </div>
  );
}
