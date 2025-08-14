import { Marker } from 'react-leaflet';
import { useFilters } from '../../../context/FiltersContext';
import type { AcaoBasicInfoModel } from '../../../types/Acao';
import { AcaoPolygon } from './AcaoPolygon';
import { useMapActions } from '../../../context/MapActions';
import { useOcorrencias } from '../../../context/OcorrenciasContext';
import { getConvexHull } from '../../../utils/geometry';
import { useNavigate } from 'react-router-dom';
import { AcaoTooltip } from './AcaoTooltip';
import { Icon } from 'leaflet';

export function AcaoMapPins() {
  const { isVisibleAcoesInMap, acoesFiltradas, denunciasFiltradas } =
    useFilters();
  const { salvarAcaoOnclick, toggleAcaoSelecionada, acaoSelecionada } =
    useMapActions();
  const { denuncias } = useOcorrencias();

  const navigate = useNavigate();

  function handleOnAcaoClick(acao: AcaoBasicInfoModel) {
    if (salvarAcaoOnclick) {
      toggleAcaoSelecionada(acao);
    } else {
      navigate(`/ocorrencias/acoes/${acao.id}`);
    }
  }

  if (!isVisibleAcoesInMap) {
    return null;
  }

  function handleGetActionIcon(acao: AcaoBasicInfoModel) {
    const isSelected = acao.id === acaoSelecionada?.id;
    const iconSize = isSelected ? 36 : 32;

    return new Icon({
      iconUrl: '/icons/acao.png',
      iconSize: [iconSize, iconSize],
      iconAnchor: [iconSize / 2, iconSize],
      popupAnchor: [0, -iconSize],
      shadowSize: [41, 41],
      shadowAnchor: [19, 41],
    });
  }

  return (
    <>
      {acoesFiltradas.map((a) => {
        const denunciasVinculadas = denuncias.filter((d) => {
          if (
            d.idAcao === a.id &&
            denunciasFiltradas.find((df) => d.id === df.id)
          ) {
            return d;
          }
        });

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
              position={[a.latitude, a.longitude]}
              icon={handleGetActionIcon(a)}
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
