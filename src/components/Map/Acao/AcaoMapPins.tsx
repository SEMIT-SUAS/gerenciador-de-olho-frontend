import { Marker } from 'react-leaflet';
import { useFilters } from '../../../context/FiltersContext';
import type { AcaoModel } from '../../../types/Acao';
import { iconAcao } from '../../../constants/mapIcons';
import { AcaoPolygon } from './AcaoPolygon';
import { useMapActions } from '../../../context/MapActions';
import { useOcorrencias } from '../../../context/OcorrenciasContext';
import { getConvexHull } from '../../../utils/geometry';
import { useNavigate } from 'react-router-dom';
import { AcaoTooltip } from './AcaoTooltip';

export function AcaoMapPins() {
  const { isVisibleAcoesInMap, acoesFiltradas } = useFilters();
  const { salvarAcaoOnclick, setAcaoSelecionada } = useMapActions();
  const { denuncias } = useOcorrencias();

  const navigate = useNavigate();

  function handleOnAcaoClick(acao: AcaoModel) {
    if (salvarAcaoOnclick) {
      setAcaoSelecionada(acao);
    } else {
      navigate(`/ocorrencias/acoes/${acao.id}`);
    }
  }

  if (!isVisibleAcoesInMap) {
    return null;
  }

  return (
    <>
      {acoesFiltradas.map((a) => {
        const denunciasVinculadas = denuncias.filter(
          (d) => d.acao?.id === a.id,
        );
        const acaoPolygonCoords = getConvexHull(
          denunciasVinculadas.map((d) => ({
            lat: d.latitude,
            lon: d.longitude,
          })),
        );

        return (
          <div key={`acao-group-${a.id}`}>
            <Marker
              key={`a-${a.id}`}
              position={[a.latitude, a.longitude]}
              icon={iconAcao}
              eventHandlers={{
                click: () => handleOnAcaoClick(a),
              }}
            >
              {!salvarAcaoOnclick && <AcaoTooltip acao={a} />}
            </Marker>

            {denunciasVinculadas.length > 0 && (
              <AcaoPolygon coordinates={acaoPolygonCoords} />
            )}
          </div>
        );
      })}
    </>
  );
}
