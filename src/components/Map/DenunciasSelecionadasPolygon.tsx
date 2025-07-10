import type { LatLngExpression, PathOptions } from 'leaflet';
import { Polygon } from 'react-leaflet';

const defaultStyle: PathOptions = {
  color: '#0d6efd',
  fillColor: '#0d6efd',
  weight: 2.5,
  fillOpacity: 0.6,
};

export function DenunciasSelecionadasPolygon({
  coordinates,
}: {
  coordinates: LatLngExpression[];
}) {
  return (
    <Polygon
      pathOptions={defaultStyle}
      positions={coordinates}
      {...defaultStyle}
    />
  );
}
