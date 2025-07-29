import { Marker, useMap } from 'react-leaflet';
import { useFilters } from '../../../context/FiltersContext';
import { getDenunciaIconByTipo } from '../../../utils/getPinIcon';
import { useMapActions } from '../../../context/MapActions';
import type { DenunciaModel } from '../../../types/Denuncia';
import { DenunciasSelecionadasPolygon } from './DenunciasSelecionadasPolygon';
import { getConvexHull } from '../../../utils/geometry';
import { DenunciaTooltip } from './DenunciaTooltip';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, type LeafletMouseEvent } from 'leaflet';

export function DenunciaMapPins() {
  const { denunciasFiltradas, isVisibleDenunciasInMap } = useFilters();

  const {
    salvarDenunciasOnclick,
    addDenunciaNaSelecao,
    denunciasSelecionas,
    denunciasJaVinculadas,
    setIsSelectingNewDenuncia,
    setNewDenunciaCoordinates,
    isSelectingNewDenuncia,
    newDenunciaCoordinates,
  } = useMapActions();

  const navigate = useNavigate();
  const map = useMap();

  const denunciaPolygonCoordinates = useMemo(() => {
    return getConvexHull(
      [...denunciasSelecionas, ...denunciasJaVinculadas].map((d) => ({
        lat: d.latitude,
        lon: d.longitude,
      })),
    );
  }, [denunciasSelecionas, denunciasJaVinculadas]);

  useEffect(() => {
    function handleClick(event: LeafletMouseEvent) {
      if (isSelectingNewDenuncia) {
        setNewDenunciaCoordinates({
          lat: event.latlng.lat,
          lng: event.latlng.lng,
        });

        setIsSelectingNewDenuncia(false);
        map.off('click');
      }
    }

    map.on('click', handleClick);
  }, [
    isSelectingNewDenuncia,
    setNewDenunciaCoordinates,
    setIsSelectingNewDenuncia,
  ]);

  function handleOnDenunciaClick(currentDenuncia: DenunciaModel) {
    if (salvarDenunciasOnclick) {
      addDenunciaNaSelecao(currentDenuncia);
    } else {
      navigate(`/ocorrencias/denuncias/${currentDenuncia.id}`);
    }
  }

  if (!isVisibleDenunciasInMap) {
    return null;
  }

  function handleGetIcon(denuncia: DenunciaModel) {
    let isSelected = false;

    if (denunciasSelecionas.find((d) => d.id == denuncia.id)) {
      isSelected = true;
    }

    return getDenunciaIconByTipo(denuncia.tipo.nome, isSelected);
  }

  return (
    <>
      {denunciasFiltradas.map((d) => {
        return (
          <Marker
            key={`d-${d.id}`}
            position={[d.latitude, d.longitude]}
            icon={handleGetIcon(d)}
            eventHandlers={{
              click: () => handleOnDenunciaClick(d),
            }}
          >
            {!salvarDenunciasOnclick && <DenunciaTooltip denuncia={d} />}

            {denunciaPolygonCoordinates.length > 0 && (
              <DenunciasSelecionadasPolygon
                coordinates={denunciaPolygonCoordinates}
              />
            )}
          </Marker>
        );
      })}

      {!isSelectingNewDenuncia && newDenunciaCoordinates && (
        <Marker
          position={[newDenunciaCoordinates.lat, newDenunciaCoordinates.lng]}
          icon={
            new Icon({
              iconUrl: '/icons/sirene.png',
              iconSize: [32, 32],
              iconAnchor: [32 / 2, 32],
              popupAnchor: [0, -32],
              shadowSize: [41, 41],
              shadowAnchor: [19, 41],
            })
          }
        />
      )}
    </>
  );
}
