import { Marker } from 'react-leaflet';
import { useFilters } from '@/context/FiltersContext';
import type { AcaoDetailsModel, AcaoModel, AcaoInMap } from '@/types/Acao'; // Garanta que AcaoInMap está importado se necessário
import { AcaoPolygon } from './AcaoPolygon';
import { useMapActions } from '@/context/MapActions';
import { getConvexHull } from '@/utils/geometry';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'leaflet';

export function AcaoMapPins() {
  const { isVisibleAcoesInMap, denunciasDoBairro, acoesDoBairro } =
    useFilters();
  const { salvarAcaoOnclick, toggleAcaoSelecionada, acaoSelecionada } =
    useMapActions();

  const navigate = useNavigate();

  function handleOnAcaoClick(acao: AcaoDetailsModel) {
    if (salvarAcaoOnclick) {
      toggleAcaoSelecionada(acao);
    } else {
      navigate(`/ocorrencias/acoes/${acao.acao.id}`);
    }
  }

  if (!isVisibleAcoesInMap) {
    return null;
  }

  function handleGetActionIcon(acao: AcaoModel) {
    const isSelected = acao.id === acaoSelecionada?.acao.id;
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
        const denunciasVinculadas = denunciasDoBairro.filter(
          (d) =>
            d.idAcao === a.id && denunciasDoBairro.find((df) => d.id === df.id),
        );

        const acaoPolygonCoords = getConvexHull(
          denunciasVinculadas.map((d) => ({
            lat: d.latitude,
            lon: d.longitude,
          })),
        );

        // --- INÍCIO DA CORREÇÃO ---
        // 1. Crie o objeto no formato AcaoDetailsModel
        const acaoDetails: AcaoDetailsModel = {
          acao: a, // A propriedade 'acao' recebe o objeto 'a' (AcaoInMap)
          denuncias: denunciasVinculadas, // A propriedade 'denuncias' recebe a lista que você filtrou
        };
        // --- FIM DA CORREÇÃO ---

        return (
          <div key={`acao-group-${a.id}`}>
            <Marker
              key={`a-${a.id}`}
              position={[a.latitude, a.longitude]}
              icon={handleGetActionIcon(a)}
              eventHandlers={{
                click: () => handleOnAcaoClick(acaoDetails),
              }}
            ></Marker>

            {denunciasVinculadas.length > 0 && (
              <AcaoPolygon coordinates={acaoPolygonCoords} />
            )}
          </div>
        );
      })}
    </>
  );
}
