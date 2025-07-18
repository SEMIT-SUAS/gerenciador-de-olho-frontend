import { Marker } from 'react-leaflet';
import { useFilters } from '../../context/FiltersContext';
import { getDenunciaIconByTipo } from '../../utils/getPinIcon';
import { useMapActions } from '../../context/MapActions';
import type { Denuncia } from '../../types/Denuncia';
import { DenunciasSelecionadasPolygon } from './DenunciasSelecionadasPolygon';
import { getConvexHull } from '../../utils/geometry';
import { PinDetailsDenuncia } from './PinDetailsDenuncia';
import { useMemo } from 'react';

export function DenunciaPins() {
  const { denunciasFiltradas, isVisibleDenunciasInMap } = useFilters();
  const {
    salvarDenunciasOnclick,
    addDenunciaNaSelecao,
    denunciasSelecionas,
    denunciasJaVinculadas,
  } = useMapActions();

  function handleOnDenunciaClick(denunciaSelecionada: Denuncia) {
    if (salvarDenunciasOnclick) {
      addDenunciaNaSelecao(denunciaSelecionada);
    }
  }

  if (!isVisibleDenunciasInMap) {
    return null;
  }

  const denunciaPolygonCoordinates = useMemo(() => {
    return getConvexHull(
      [...denunciasSelecionas, ...denunciasJaVinculadas].map((d) => ({
        lat: d.endereco.latitude,
        lon: d.endereco.longitude,
      })),
    );
  }, [denunciasSelecionas, denunciasJaVinculadas]);

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

            {denunciaPolygonCoordinates.length > 0 && (
              <DenunciasSelecionadasPolygon
                coordinates={denunciaPolygonCoordinates}
              />
            )}
          </Marker>
        );
      })}
    </>
  );
}
