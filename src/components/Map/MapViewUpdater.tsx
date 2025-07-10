import { useContext, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useOcorrenciasContext } from '../../context/ocorrenciasContext';
import { AddDenunciaContext } from '../../context/AddDenunciaContext';

export function MapViewUpdater() {
  const map = useMap();
  const { actualDetailItem } = useOcorrenciasContext();
  const {
    isSelectingNewDenunciaInMap,
    setIsSelectingNewDenunciaInMap,
    setNewDenunciaCoordinates,
  } = useContext(AddDenunciaContext);

  useEffect(() => {
    function handleClick(event: any) {
      if (isSelectingNewDenunciaInMap) {
        setNewDenunciaCoordinates({
          latitude: event.latlng.lat,
          longitude: event.latlng.lng,
        });

        setIsSelectingNewDenunciaInMap(false);
        map.off('click');
      }
    }

    map.on('click', handleClick);
  }, [
    isSelectingNewDenunciaInMap,
    setNewDenunciaCoordinates,
    setIsSelectingNewDenunciaInMap,
  ]);

  useEffect(() => {
    if (actualDetailItem) {
      if ('endereco' in actualDetailItem) {
        map.flyTo(
          {
            lat: actualDetailItem.endereco.latitude,
            lng: actualDetailItem.endereco.longitude,
          },
          16,
        );
      } else {
        map.flyTo(
          {
            lat: actualDetailItem.lat,
            lng: actualDetailItem.lon,
          },
          16,
        );
      }
    }
  }, [actualDetailItem]);

  return null;
}
