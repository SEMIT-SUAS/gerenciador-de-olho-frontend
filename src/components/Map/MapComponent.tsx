import React, { useContext, useEffect, type Dispatch, type SetStateAction } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, Polygon } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { iconAcao, selectedIcon } from '../../constants/mapIcons'
import type { StatusModel } from '../../types/StatusModel'
import type { Denuncia } from '../../types/Denuncia'
import type { Acao } from '../../types/Acao'
import { AddDenunciaContext } from '../../context/AddDenunciaContext'
import { getDenunciaIconByTipo } from '../../utils/getPinIcon'
import type { LeafletMouseEvent } from 'leaflet'
import type { ZoomToProps } from '../../pages/OcorrenciasPage'
import { useVincularDenunciaContext } from '../../context/vincularDenunciaContext'
import { useMapEvents } from 'react-leaflet'

interface MapComponentProps {
  denuncias: Denuncia[];
  acoes: Acao[];
  modoSelecao: boolean;
  denunciasSelecionadas: number[];
  onMarkerClick: (item: Denuncia | Acao, zoomToData: ZoomToProps) => void;
  onSelectionClick: (id: number, status: StatusModel) => void;
  detailViewItem: Denuncia | Acao | null;
  zoomTo: ZoomToProps,
  setZoomTo: Dispatch<SetStateAction<ZoomToProps>>
}

export function MapComponent({
  denuncias,
  acoes,
  modoSelecao,
  onMarkerClick,
  detailViewItem,
  zoomTo,
  setZoomTo,
}: MapComponentProps) {
  const {
    isSelectingNewDenunciaInMap,
    setIsSelectingNewDenunciaInMap,
    setNewDenunciaCoordinates,
    newDenunciaCoordinates,
  } = useContext(AddDenunciaContext)

  const {isSelectingAcaoInMap, setAcaoParaVincular, acaoParaVincular} = useVincularDenunciaContext()

    type MapViewUpdaterProps = {
      item: Denuncia | Acao | null
    }

    function MapViewUpdater({ item }: MapViewUpdaterProps) {
      const map = useMap()

      useEffect(() => {
        function handleClick(event: any) {
          if (isSelectingNewDenunciaInMap) {
            setNewDenunciaCoordinates({
              latitude: event.latlng.lat,
              longitude: event.latlng.lng,
            })

            setIsSelectingNewDenunciaInMap(false)
            map.off('click')
          }
      }

        map.on('click', handleClick)
      }, [isSelectingNewDenunciaInMap, setNewDenunciaCoordinates, setIsSelectingNewDenunciaInMap])

      useEffect(() => {
        if (zoomTo) {
          map.flyTo({
            lat: zoomTo.lat,
            lng: zoomTo.lng,
          }, 16)

          setZoomTo(null)
        }
      }, [zoomTo, setZoomTo])

      return null
    }

    const handleMarkerClick = (item: Denuncia | Acao, event: LeafletMouseEvent) => {
      onMarkerClick(item, {
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      })
    }

    return (
      <MapContainer center={[-2.51, -44.28]} zoom={13} scrollWheelZoom className="h-full w-full z-10">
        <MapViewUpdater item={detailViewItem} />

        <TileLayer
          attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
          url="https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=XLhcrfhE5GT4MmbYP817"
          tileSize={512}
          zoomOffset={-1}
        />

        {!isSelectingNewDenunciaInMap && !isSelectingAcaoInMap && denuncias.map(d => {
          return (
            <Marker
              key={`d-${d.id}`}
              position={[d.endereco.latitude, d.endereco.longitude]}
              icon={getDenunciaIconByTipo(d.tipo)}
              eventHandlers={{
                click: (event) => {
                  handleMarkerClick(d, event)
                },
              }}
            >
              {!modoSelecao && <Popup><b>Denúncia:</b> {d.titulo}<br /><b>Status:</b> <span className="capitalize">{d?.status?.replace('_', ' ')}</span></Popup>}
            </Marker>
          )
        })}

        {!isSelectingNewDenunciaInMap && acoes.map(a => (
          <React.Fragment key={`acao-group-${a.id}`}>
            <Marker
              key={`a-${a.id}`}
              position={[a.lat, a.lon]}
              icon={iconAcao}
              eventHandlers={{
                click: event => { 
                if(isSelectingAcaoInMap){
                    setAcaoParaVincular(a)
                  } else {
                    handleMarkerClick(a, event)
                  }
                }
              }}
            >
              {!modoSelecao && <Popup><b>Ação:</b> {a.nome}<br /><b>Secretaria:</b> {a.secretaria}</Popup>}
            </Marker>
            {a.polygonCoords.length > 0 && <Polygon pathOptions={{ color: 'green', weight: 2, fillOpacity: 0.1 }} positions={a.polygonCoords} />}
          </React.Fragment>
        ))}


        {newDenunciaCoordinates &&
          <Marker
            position={[newDenunciaCoordinates.latitude, newDenunciaCoordinates.longitude]}
            icon={selectedIcon}
          />}
      </MapContainer>
    )
};
