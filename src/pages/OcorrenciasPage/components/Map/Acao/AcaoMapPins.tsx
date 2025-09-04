import { Marker } from 'react-leaflet';
import { useFilters } from '@/context/FiltersContext';
import type { AcaoInMap } from '@/types/Acao'; // Garanta que AcaoInMap está importado se necessário
import { AcaoPolygon } from './AcaoPolygon';
import { useMapActions } from '@/context/MapActions';
import { getConvexHull } from '@/utils/geometry';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'leaflet';

export function AcaoMapPins() {
  const {
    isVisibleAcoesInMap,
    denunciasDoBairro,
    acoesDoBairro,
    setAcoesDoBairro,
  } = useFilters();
  const {
    salvarAcaoOnclick,
    toggleAcaoSelecionada,
    acaoSelecionada,
    setDenunciaVinculadas,
    denunciasVinculadas,
    salvarDenunciasOnclick,
  } = useMapActions();

  const navigate = useNavigate();

  function handleOnAcaoClick(acao: AcaoInMap) {
    if (salvarAcaoOnclick) {
      toggleAcaoSelecionada(acao);
    } else {
      navigate(`/ocorrencias/acoes/${acao.id}`);
      setDenunciaVinculadas(
        denunciasDoBairro
          .filter((denunciaBairro) => denunciaBairro.idAcao === acao?.id)
          .map((denuncia) => denuncia),
      );
    }
  }

  function handleGetActionIcon(acao: AcaoInMap) {
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
      {acoesDoBairro.map((a) => {
        const denunciasVinculadasAcao = denunciasDoBairro.filter(
          (d) =>
            d.idAcao === a.id && denunciasDoBairro.find((df) => d.id === df.id),
        );

        const acaoPolygonCoords = getConvexHull(
          denunciasVinculadasAcao.map((d) => ({
            lat: d.latitude,
            lon: d.longitude,
          })),
        );

        const acaoPolygonVincularCoords = getConvexHull(
          denunciasVinculadas.map((d) => ({
            lat: d.latitude,
            lon: d.longitude,
          })),
        );

        return (
          <div key={`acao-group-${a.id}`}>
            {isVisibleAcoesInMap && (
              <Marker
                key={`a-${a.id}`}
                position={[a.latitude, a.longitude]}
                icon={handleGetActionIcon(a)}
                eventHandlers={{
                  click: () => handleOnAcaoClick(a),
                }}
              ></Marker>
            )}

            {denunciasVinculadasAcao.length > 0 && (
              <AcaoPolygon coordinates={acaoPolygonCoords} />
            )}

            {salvarDenunciasOnclick && (
              <AcaoPolygon coordinates={acaoPolygonVincularCoords} />
            )}
          </div>
        );
      })}
    </>
  );
}
