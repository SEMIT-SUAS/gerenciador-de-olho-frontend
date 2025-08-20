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
      {bairros.map((bairro) => {
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
                color: bairro.id === currentBairroId ? '#9ac670' : '#39a6de',
                fillColor: bairro.id === currentBairroId ? '' : 'lightblue',
                fillOpacity: 0.2,
              }}
              eventHandlers={{
                click: () => handleOnClickAtBairro(bairro),
              }}
            />
            {bairro.totalDeDenuncias > 0 && !currentBairroId && (
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
