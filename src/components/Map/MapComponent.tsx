import { useContext } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { iconAcao, selectedIcon } from '../../constants/mapIcons';
import type { Denuncia } from '../../types/Denuncia';
import type { Acao } from '../../types/Acao';
import { AddDenunciaContext } from '../../context/AddDenunciaContext';
import { getDenunciaIconByTipo } from '../../utils/getPinIcon';
import { MapFilters } from './MapFilters';
import { useFilters } from '../../context/FiltersContext';
import { MapViewUpdater } from './MapViewUpdater';
import { useOcorrenciasContext } from '../../context/OcorrenciasContext';
import { PinDetailsAcao } from './PinDetailsAcao';
import { AcaoPolygon } from './AcaoPolygon';
import { PinDetailsDenuncia } from './PinDetailsDenuncia';
import { useAddAcao } from '../../context/AddAcaoContext';
import { DenunciasSelecionadasPolygon } from './DenunciasSelecionadasPolygon';
import { getConvexHull } from '../../utils/geometry';
import { useVincularDenunciaContext } from '../../context/vincularDenunciaContext';
import { toast } from 'react-toastify';
import { useVincularItemContext } from '../../context/VincularItemContext';

export function MapComponent() {
  const { isSelectingNewDenunciaInMap, newDenunciaCoordinates } =
    useContext(AddDenunciaContext);
  const { setActualDetailItem } = useOcorrenciasContext();
  const {
    isVisibleAcoesInMap,
    isVisibleDenunciasInMap,
    acoesFiltradas: acoes,
    denunciasFiltradas: denuncias,
  } = useFilters();
  const { denunciasVinculadas, isAddingAcao, setDenunciasVinculadas } =
    useAddAcao();
  const {isAddingDenunciaAcao} = useVincularItemContext();   
  const handleMarkerClick = (item: Denuncia | Acao) => {
    setActualDetailItem(item);
  };

  const { isSelectingAcaoInMap, setAcaoParaVincular } =
    useVincularDenunciaContext();

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

        {!isSelectingNewDenunciaInMap &&
          isVisibleDenunciasInMap &&
          !isSelectingAcaoInMap &&
          denuncias.map((d) => {
            return (
              <Marker
                key={`d-${d.id}`}
                position={[d.endereco.latitude, d.endereco.longitude]}
                icon={getDenunciaIconByTipo(d.tipo.name)}
                eventHandlers={{
                  click: () => {
                    if (isAddingAcao || isAddingDenunciaAcao) {
                      if (denunciasVinculadas.find((dc) => dc.id == d.id)) {
                        toast('Você já vincolou essa denúncia a essa ação', {
                          type: 'error',
                        });
                      } else {
                        setDenunciasVinculadas([...denunciasVinculadas, d]);
                      }
                    } else {
                      handleMarkerClick(d);
                    }
                  },
                }}
              >
                {!isAddingAcao && <PinDetailsDenuncia denuncia={d} />}

                {isAddingAcao && denunciasVinculadas.length > 0 && (
                  <DenunciasSelecionadasPolygon
                    coordinates={getConvexHull(
                      denunciasVinculadas.map((d) => ({
                        lat: d.endereco.latitude,
                        lon: d.endereco.longitude,
                      })),
                    )}
                  />
                )}
              </Marker>
            );
          })}

        {!isSelectingNewDenunciaInMap &&
          isVisibleAcoesInMap &&
          acoes.map((a) => (
            <div key={`acao-group-${a.id}`}>
              <Marker
                key={`a-${a.id}`}
                position={[a.lat, a.lon]}
                icon={iconAcao}
                eventHandlers={{
                  click: () => {
                    if (isSelectingAcaoInMap) {
                      setAcaoParaVincular(a);
                    } else {
                      handleMarkerClick(a);
                    }
                  },
                }}
              >
                <PinDetailsAcao acao={a} />
              </Marker>

              {a.polygonCoords.length > 0 && (
                <AcaoPolygon coordinates={a.polygonCoords} />
              )}
            </div>
          ))}

        {newDenunciaCoordinates && (
          <Marker
            position={[
              newDenunciaCoordinates.latitude,
              newDenunciaCoordinates.longitude,
            ]}
            icon={selectedIcon}
          />
        )}
      </MapContainer>
    </div>
  );
}
