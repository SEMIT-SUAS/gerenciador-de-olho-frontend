import { Marker } from 'react-leaflet';
import { useFilters } from '../../context/FiltersContext';
import type { Acao } from '../../types/Acao';
import { iconAcao } from '../../constants/mapIcons';
import { PinDetailsAcao } from './PinDetailsAcao';
import { AcaoPolygon } from './AcaoPolygon';
import { useMapActions } from '../../context/MapActions';

export function AcaoPins() {
  const { isVisibleAcoesInMap, acoesFiltradas } = useFilters();
  const { salvarAcaoOnclick, setAcaoSelecionada } = useMapActions();

  function handleOnAcaoClick(acao: Acao) {
    if (salvarAcaoOnclick) {
      setAcaoSelecionada(acao);
    }
  }

  if (!isVisibleAcoesInMap) {
    return null;
  }

  return (
    <>
      {acoesFiltradas.map((a) => (
        <div key={`acao-group-${a.id}`}>
          <Marker
            key={`a-${a.id}`}
            position={[a.lat, a.lon]}
            icon={iconAcao}
            eventHandlers={{
              click: () => handleOnAcaoClick(a),
            }}
          >
            <PinDetailsAcao acao={a} />
          </Marker>

          {a.polygonCoords.length > 0 && (
            <AcaoPolygon coordinates={a.polygonCoords} />
          )}
        </div>
      ))}
    </>
  );
}
