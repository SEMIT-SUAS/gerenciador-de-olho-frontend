import { Marker } from 'react-leaflet';
import { useFilters } from '../../context/FiltersContext';
import type { Acao } from '../../types/Acao';
import { iconAcao } from '../../constants/mapIcons';
import { PinDetailsAcao } from './PinDetailsAcao';
import { AcaoPolygon } from './AcaoPolygon';
import { useMapActions } from '../../context/MapActions';
import { useOcorrenciasContext } from '../../context/OcorrenciasContext';
import { getConvexHull } from '../../utils/geometry';
import { useNavigate } from 'react-router-dom';

export function AcaoPins() {
  const { isVisibleAcoesInMap, acoesFiltradas } = useFilters();
  const { salvarAcaoOnclick, setAcaoSelecionada } = useMapActions();
  const { denuncias } = useOcorrenciasContext();

  const navigate = useNavigate();

  function handleOnAcaoClick(acao: Acao) {
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
        const denunciasVinculadas = denuncias.filter((d) => d.acaoId === a.id);
        const acaoPolygonCoords = getConvexHull(
          denunciasVinculadas.map((d) => ({
            lat: d.endereco.latitude,
            lon: d.endereco.longitude,
          })),
        );

        return (
          <div key={`acao-group-${a.id}`}>
            <Marker
              key={`a-${a.id}`}
              position={[a.lat, a.lon]}
              icon={iconAcao}
              eventHandlers={{
                click: () => handleOnAcaoClick(a),
              }}
            >
              {!salvarAcaoOnclick && <PinDetailsAcao acao={a} />}
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
