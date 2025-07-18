import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapFilters } from './MapFilters';
import { MapViewUpdater } from './MapViewUpdater';
import { DenunciaPins } from './DenunciaPins';
import { AcaoPins } from './AcaoPins';

export function MapComponent() {
  return (
    <div className="relative h-full w-full">
      <MapFilters />
      <MapContainer
        center={[-2.51, -44.28]}
        zoom={13}
        scrollWheelZoom
        className="h-full w-full z-10"
      >
        <MapViewUpdater />

        <TileLayer
          attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
          url="https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=XLhcrfhE5GT4MmbYP817"
          tileSize={512}
          zoomOffset={-1}
        />

        <DenunciaPins />
        <AcaoPins />
      </MapContainer>
    </div>
  );
}
