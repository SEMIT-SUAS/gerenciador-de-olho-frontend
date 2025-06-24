import React from 'react';
import type { FC } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Denuncia, Acao } from '../../types/ocorrencias';
import { iconDenuncia, iconDenunciaSelecionada, iconDenunciaEmAtendimento, iconAcao } from '../../constants/mapIcons';

export interface MapComponentProps {
    denuncias: Denuncia[];
    acoes: Acao[];
    modoSelecao: boolean;
    denunciasSelecionadas: number[];
    onMarkerClick: (id: number, status: 'aberto' | 'em_atendimento') => void;
    onAcaoClick: (acao: Acao) => void;
}

export const MapComponent: FC<MapComponentProps> = ({ denuncias, acoes, modoSelecao, denunciasSelecionadas, onMarkerClick, onAcaoClick }) => {
    const MapCursor: FC<{ modoSelecao: boolean }> = ({ modoSelecao }) => {
        const map = useMap();
        map.getContainer().style.cursor = modoSelecao ? 'pointer' : 'grab';
        return null;
    }

    return (
        <MapContainer center={[-2.51, -44.28]} zoom={13} scrollWheelZoom={true} className="h-full w-full">
            <MapCursor modoSelecao={modoSelecao} />
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>' url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
            
            {denuncias.map(d => {
                const isSelected = modoSelecao && denunciasSelecionadas.includes(d.id);
                let icon;
                if (d.status === 'aberto') icon = isSelected ? iconDenunciaSelecionada : iconDenuncia;
                else icon = iconDenunciaEmAtendimento;
                
                return (
                    <Marker key={`d-${d.id}`} position={[d.lat, d.lon]} icon={icon} eventHandlers={{ click: () => onMarkerClick(d.id, d.status) }}>
                        {!modoSelecao && <Popup><b>Denúncia:</b> {d.titulo}<br/><b>Status:</b> {d.status === 'aberto' ? 'Aberto' : 'Em Atendimento'}</Popup>}
                    </Marker>
                );
            })}
            
            {acoes.map(a => (
                <React.Fragment key={`acao-group-${a.id}`}>
                    <Marker key={`a-${a.id}`} position={[a.lat, a.lon]} icon={iconAcao} eventHandlers={{ click: () => onAcaoClick(a) }}>
                        {!modoSelecao && <Popup><b>Ação:</b> {a.nome}<br/><b>Secretaria:</b> {a.secretaria}</Popup>}
                    </Marker>
                    {a.polygonCoords.length > 0 && <Polygon pathOptions={{ color: 'green', weight: 2, fillOpacity: 0.1 }} positions={a.polygonCoords} />}
                </React.Fragment>
            ))}
        </MapContainer>
    );
};