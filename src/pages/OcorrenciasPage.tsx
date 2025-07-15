import { SidePanel } from '../components/SidePanel/SidePanel';
import { MapComponent } from '../components/Map/MapComponent';
import { AddDenunciaProvider } from '../context/AddDenunciaContext';
import { VincularDenunciaProvider } from '../context/vincularDenunciaContext';
import { AddAcaoProvider } from '../context/AddAcaoContext';
import { Outlet } from 'react-router-dom';
import { FiltersProvider } from '../context/FiltersContext';

export function OcorrenciasPage() {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <FiltersProvider>
        <VincularDenunciaProvider>
          <AddDenunciaProvider>
            <AddAcaoProvider>
              <SidePanel>
                <Outlet />
              </SidePanel>

              <main className="flex-1 z-10 relative">
                <MapComponent />
              </main>
            </AddAcaoProvider>
          </AddDenunciaProvider>
        </VincularDenunciaProvider>
      </FiltersProvider>
    </div>
  );
}
