import type { LeafletMouseEvent } from 'leaflet';
import { type Dispatch, type SetStateAction } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';

function MapClickHandler({
  onClick,
}: {
  onClick: (event: LeafletMouseEvent) => void;
}) {
  const map = useMap();
  map.on('click', onClick);

  return null;
}

interface SelectLocationInMapProps {
  position: [number, number] | null;
  setPosition:
    | Dispatch<SetStateAction<[number, number] | null>>
    | Dispatch<SetStateAction<[number, number]>>;
}

export function SelectLocationInMap({
  position,
  setPosition,
}: SelectLocationInMapProps) {
  function onMapClickEnvet(event: LeafletMouseEvent) {
    setPosition([event.latlng.lat, event.latlng.lng]);
  }

  return (
    <MapContainer
      center={[-2.51, -44.28]}
      zoom={13}
      scrollWheelZoom
      className="h-full w-full z-10"
    >
      <TileLayer
        attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
        url="https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=XLhcrfhE5GT4MmbYP817"
        tileSize={512}
        zoomOffset={-1}
      />

      {position && <Marker position={position} />}

      <MapClickHandler onClick={onMapClickEnvet} />
    </MapContainer>
  );
}
