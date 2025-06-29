import React, { useEffect, type FC } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { iconDenuncia, iconDenunciaSelecionada, iconDenunciaEmAtendimento, iconAcao } from '../../constants/mapIcons';
import type { StatusModel } from '../../types/StatusModel';
import type { Denuncia } from '../../types/Denuncia';
import type { Acao } from '../../types/Acao';

interface MapComponentProps {
    denuncias: Denuncia[];
    acoes: Acao[];
    modoSelecao: boolean;
    denunciasSelecionadas: number[];
    onMarkerClick: (item: Denuncia | Acao) => void;
    onSelectionClick: (id: number, status: StatusModel) => void;
    detailViewItem: Denuncia | Acao | null;
}

export function MapComponent({
    denuncias,
    acoes,
    modoSelecao,
    denunciasSelecionadas,
    onMarkerClick,
    onSelectionClick,
    detailViewItem
}: MapComponentProps) {
    
    const MapViewUpdater: FC<{ item: Denuncia | Acao | null }> = ({ item }) => {
        const map = useMap();
        useEffect(() => {
            if (item) {
                map.flyTo([item.lat, item.lon], 16);
            }
        }, [item, map]);
        return null;
    }

    const MapCursor: FC<{ modoSelecao: boolean }> = ({ modoSelecao }) => {
        const map = useMap();
        useEffect(() => {
            map.getContainer().style.cursor = modoSelecao ? 'pointer' : 'grab';
        }, [modoSelecao, map]);
        return null;
    }

    const handleMarkerClick = (item: Denuncia | Acao) => {
        if (modoSelecao && 'status' in item && item.status === 'aberto') {
            onSelectionClick(item.id, item.status);
        } else if (!modoSelecao) {
            onMarkerClick(item);
        }
    }

    return (
        <MapContainer center={[-2.51, -44.28]} zoom={13} scrollWheelZoom={true} className="h-full w-full z-10">
            <MapViewUpdater item={detailViewItem} />
            <MapCursor modoSelecao={modoSelecao} />
            <TileLayer
                attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
                url="https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=XLhcrfhE5GT4MmbYP817"
            />

            {denuncias.map(d => {
                const isSelected = modoSelecao && denunciasSelecionadas.includes(d.id);
                let icon;
                if (d.status === 'aberto') icon = isSelected ? iconDenunciaSelecionada : iconDenuncia;
                else if (d.status === 'em_andamento') icon = iconDenunciaEmAtendimento;

                return (
                    <Marker key={`d-${d.id}`} position={[d.lat, d.lon]} icon={icon} eventHandlers={{ click: () => handleMarkerClick(d) }}>
                        {!modoSelecao && <Popup><b>Denúncia:</b> {d.titulo}<br /><b>Status:</b> <span className="capitalize">{d.status.replace('_', ' ')}</span></Popup>}
                    </Marker>
                );
            })}

            {acoes.map(a => (
                <React.Fragment key={`acao-group-${a.id}`}>
                    <Marker key={`a-${a.id}`} position={[a.lat, a.lon]} icon={iconAcao} eventHandlers={{ click: () => handleMarkerClick(a) }}>
                        {!modoSelecao && <Popup><b>Ação:</b> {a.nome}<br /><b>Secretaria:</b> {a.secretaria}</Popup>}
                    </Marker>
                    {a.polygonCoords.length > 0 && <Polygon pathOptions={{ color: 'green', weight: 2, fillOpacity: 0.1 }} positions={a.polygonCoords} />}
                </React.Fragment>
            ))}
        </MapContainer>
    );
};