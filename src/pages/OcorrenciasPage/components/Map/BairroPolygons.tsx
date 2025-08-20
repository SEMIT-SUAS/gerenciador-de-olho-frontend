import { useMapActions } from '@/context/MapActions';
import { useOcorrencias } from '@/context/OcorrenciasContext';
import type { Bairro } from '@/types/Bairro';
import { Polygon, Marker } from 'react-leaflet';

import L from 'leaflet';

export function BairroPolygons() {
  const { bairros } = useOcorrencias();
  const { setCurrentBairroId, currentBairroId, setZoomTo } = useMapActions();

  function handleOnClickAtBairro(bairro: Bairro) {
    setCurrentBairroId(bairro.id);
    setZoomTo({
      lat: bairro.centerLatitude,
      lng: bairro.centerLongitude,
      level: 16,
    });
  }

  return (
    <>
      {bairros
        .filter((bairro) => bairro.id !== currentBairroId)
        .map((bairro) => {
          const countIcon = L.divIcon({
            html: `<span>${bairro.totalDeDenuncias}</span>`,
            className: 'bairro-denuncia-count-icon',
            iconSize: [30, 30],
          });

          return (
            <div key={`bairro-container-${bairro.id}`}>
              <Polygon
                positions={bairro.coordenadas as any}
                pathOptions={{
                  color: 'blue',
                  fillColor: 'lightblue',
                  fillOpacity: 0.4,
                }}
                eventHandlers={{
                  click: () => handleOnClickAtBairro(bairro),
                }}
              />
              {bairro.totalDeDenuncias > 0 && (
                <Marker
                  position={[bairro.centerLatitude, bairro.centerLongitude]}
                  icon={countIcon}
                  interactive={false}
                />
              )}
            </div>
          );
        })}
    </>
  );
}
