import type { LatLngExpression } from 'leaflet';
import { Polygon } from 'react-leaflet';

export function AcaoPolygon({
  coordinates,
}: {
  coordinates: LatLngExpression[];
}) {
  return (
    <Polygon
      pathOptions={{ color: '#808080', weight: 2, fillOpacity: 0.1 }}
      positions={coordinates}
    />
  );
}
