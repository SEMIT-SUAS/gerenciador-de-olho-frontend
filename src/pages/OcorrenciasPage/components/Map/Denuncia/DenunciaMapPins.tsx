import { Marker, useMap } from 'react-leaflet';
import { useFilters } from '@/context/FiltersContext';
import { getDenunciaIconByTipo } from '@/utils/getPinIcon';
import { useMapActions } from '@/context/MapActions';
import type { DenunciaInMap, DenunciaModel } from '@/types/Denuncia';
import { DenunciasSelecionadasPolygon } from './DenunciasSelecionadasPolygon';
import { getConvexHull } from '@/utils/geometry';
import { DenunciaTooltip } from './DenunciaTooltip';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type LeafletMouseEvent, divIcon } from 'leaflet';

const statusIconMap: Record<string, string> = {
  indeferido: '../../../public/status/indeferido.png',
  concluido: '../../../public/status/concluido.png',
  em_andamento: '../../../public/status/em_andamento.png',
  em_aberto: '../../../public/status/em_aberto.png',
  em_analise: '../../../public/status/em_analise.png',
  default: '../../../public/status/indeferido.png',
};

export function DenunciaMapPins() {
  const { denunciasDoBairro } = useFilters();

  const { isVisibleDenunciasInMap } = useFilters();

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

  // useEffect(() => {
  //   function handleClick(event: LeafletMouseEvent) {
  //     if (isSelectingNewDenuncia) {
  //       setNewDenunciaCoordinates({
  //         lat: event.latlng.lat,
  //         lng: event.latlng.lng,
  //       });
  //       setIsSelectingNewDenuncia(false);
  //       map.off('click');
  //     }
  //   }
  //   map.on('click', handleClick);
  // }, [
  //   isSelectingNewDenuncia,
  //   setNewDenunciaCoordinates,
  //   setIsSelectingNewDenuncia,
  //   map,
  // ]);

  function handleOnDenunciaClick(currentDenuncia: DenunciaModel) {
    if (salvarDenunciasOnclick) {
      addDenunciaNaSelecao(currentDenuncia);
    } else {
      navigate(`/ocorrencias/denuncias/${currentDenuncia.id}`);
    }
  }

  function handleGetIcon(denuncia: DenunciaInMap) {
    const isSelected = !!denunciasSelecionas.find((d) => d.id === denuncia.id);

    const baseIcon = getDenunciaIconByTipo(
      denuncia.nomeTipoDenuncia,
      isSelected,
    );
    const mainIconUrl = baseIcon.options.iconUrl;
    const iconSize = baseIcon.options.iconSize as [number, number];

    const statusValue = denuncia.acaoStatus || 'default';

    const statusIconUrl = statusIconMap[statusValue] || statusIconMap.default;

    const iconHTML = `
      <div class="marker-container">
        <img src="${mainIconUrl}" style="width: ${iconSize[0]}px; height: ${iconSize[1]}px;" />
        <img src="${statusIconUrl}" class="status-badge" />
      </div>
    `;

    return divIcon({
      html: iconHTML,
      className: '',
      iconSize: iconSize,
      iconAnchor: baseIcon.options.iconAnchor,
    });
  }

  if (!isVisibleDenunciasInMap) {
    return null;
  }

  return (
    <>
      {denunciasDoBairro.map((d) => {
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
          </Marker>
        );
      })}

      {denunciaPolygonCoordinates.length > 0 && (
        <DenunciasSelecionadasPolygon
          coordinates={denunciaPolygonCoordinates}
        />
      )}

      {!isSelectingNewDenuncia && newDenunciaCoordinates && (
        <Marker
          position={[newDenunciaCoordinates.lat, newDenunciaCoordinates.lng]}
          icon={getDenunciaIconByTipo('default', true)}
        />
      )}
    </>
  );
}
