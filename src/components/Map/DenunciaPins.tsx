import { Marker } from 'react-leaflet';
import { useFilters } from '../../context/FiltersContext';
import { getDenunciaIconByTipo } from '../../utils/getPinIcon';
import { useMapActions } from '../../context/MapActions';
import type { Denuncia } from '../../types/Denuncia';
import { DenunciasSelecionadasPolygon } from './DenunciasSelecionadasPolygon';
import { getConvexHull } from '../../utils/geometry';
import { PinDetailsDenuncia } from './PinDetailsDenuncia';

export function DenunciaPins() {
  const { denunciasFiltradas, isVisibleDenunciasInMap } = useFilters();
  const { salvarDenunciasOnclick, addDenunciaNaSelecao, denunciasSelecionas } =
    useMapActions();

  function handleOnDenunciaClick(denunciaSelecionada: Denuncia) {
    if (salvarDenunciasOnclick) {
      addDenunciaNaSelecao(denunciaSelecionada);
    }
  }

  if (!isVisibleDenunciasInMap) {
    return null;
  }

  return (
    <>
      {denunciasFiltradas.map((d) => {
        return (
          <Marker
            key={`d-${d.id}`}
            position={[d.endereco.latitude, d.endereco.longitude]}
            icon={getDenunciaIconByTipo(d.tipo)}
            eventHandlers={{
              click: () => handleOnDenunciaClick(d),
            }}
          >
            <PinDetailsDenuncia denuncia={d} />

            {denunciasSelecionas.length > 0 && (
              <DenunciasSelecionadasPolygon
                coordinates={getConvexHull(
                  denunciasSelecionas.map((d) => ({
                    lat: d.endereco.latitude,
                    lon: d.endereco.longitude,
                  })),
                )}
              />
            )}
          </Marker>
        );
      })}
    </>
  );
}
