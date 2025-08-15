import type { LatLngExpression } from 'leaflet';
import { Polygon } from 'react-leaflet';

const subtleStyle = {
  color: 'orange',
  fillColor: 'red',
  weight: 1,
  fillOpacity: 0.04,
};

export function DenunciasSelecionadasPolygon({
  coordinates,
}: {
  coordinates: LatLngExpression[];
}) {
  return <Polygon pathOptions={subtleStyle} positions={coordinates} />;
}
