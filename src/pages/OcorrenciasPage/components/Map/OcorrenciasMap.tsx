import { MapContainer, TileLayer } from 'react-leaflet';
import { MapFilters } from './MapFilters';
import { BairroPolygons } from './BairroPolygons';

import 'leaflet/dist/leaflet.css';
import { MapZoom } from './MapZoom';
import { DenunciaMapPins } from './Denuncia/DenunciaMapPins';
import { AcaoMapPins } from './Acao/AcaoMapPins';
import { BackButton } from '@/components/ui/Backbutton';
import { Navbar } from '@/components/Navbar';

export function OcorrenciasMap() {
  return (
    <>
      <div className="relative h-full w-full">
        <MapFilters />
        <MapContainer
          center={[-2.51, -44.28]}
          zoom={13}
          scrollWheelZoom
          zoomControl={false}
          className="h-full w-full z-10"
        >
          <TileLayer
            attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
            url="https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=XLhcrfhE5GT4MmbYP817"
            tileSize={512}
            zoomOffset={-1}
          />

          <MapZoom />
          <DenunciaMapPins />
          <AcaoMapPins />
          <BairroPolygons />
        </MapContainer>
      </div>
    </>
  );
}
