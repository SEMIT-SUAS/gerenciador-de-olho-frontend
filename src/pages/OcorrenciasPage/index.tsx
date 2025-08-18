import { MapLoading } from '@/components/Loading/MapLoading';
import { useOcorrencias } from '@/context/OcorrenciasContext';
import { OcorrenciasMap } from './components/Map/OcorrenciasMap';

export function OcorrenciasPage() {
  const { isLoadingInitialContent } = useOcorrencias();

  return (
    <div className="h-screen w-full relative">
      {isLoadingInitialContent ? <MapLoading /> : <OcorrenciasMap />}
    </div>
  );
}
