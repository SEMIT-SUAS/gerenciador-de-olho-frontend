import { useMapActions } from '@/context/MapActions';
import { useOcorrencias } from '@/context/OcorrenciasContext';
import type { Bairro } from '@/types/Bairro';
import { Polygon } from 'react-leaflet';

export function BairroPolygons() {
  const { bairros } = useOcorrencias();
  const { setCurrentBairroId, currentBairroId, setZoomTo } = useMapActions();

  function handleOnClickAtBairro(bairro: Bairro) {
    setCurrentBairroId(bairro.id);
    setZoomTo({
      lat: bairro.centerLatitude,
      lng: bairro.centerLongitude,
    });
  }

  return (
    <>
      {bairros
        .filter((bairro) => bairro.id !== currentBairroId)
        .map((bairro) => (
          <Polygon
            key={`bairro-${bairro.id}`}
            positions={bairro.coordenadas as any}
            eventHandlers={{
              click: () => handleOnClickAtBairro(bairro),
            }}
          />
        ))}
    </>
  );
}
