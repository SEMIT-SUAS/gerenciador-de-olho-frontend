import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useMapActions } from '../../context/MapActions';

export function MapViewUpdater() {
  const map = useMap();

  const { zoomTo } = useMapActions();

  useEffect(() => {
    if (zoomTo) {
      const { lat, lng } = zoomTo;

      map.flyTo(
        {
          lat,
          lng,
        },
        16,
      );
    }
  }, [zoomTo]);

  return null;
}
