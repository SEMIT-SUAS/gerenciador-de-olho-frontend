import { SidePanel } from '../components/SidePanel/SidePanel';
import { MapComponent } from '../components/Map/MapComponent';
import { useOcorrenciasContext } from '../context/OcorrenciasContext';
import { AddDenunciaProvider } from '../context/AddDenunciaContext';
import { VincularDenunciaProvider } from '../context/vincularDenunciaContext';
import { AddAcaoProvider } from '../context/AddAcaoContext';

export function OcorrenciasPage() {
  const { loading, error } = useOcorrenciasContext();

  if (loading)
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        Carregando...
      </div>
    );
  if (error)
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        Erro: {error}
      </div>
    );

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <VincularDenunciaProvider>
        <AddDenunciaProvider>
          <AddAcaoProvider>
            <SidePanel />

            <main className="flex-1 z-10 relative">
              <MapComponent />
            </main>
          </AddAcaoProvider>
        </AddDenunciaProvider>
      </VincularDenunciaProvider>
    </div>
  );
}
