import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useMapActions } from '@/context/MapActions';

export function MapZoom() {
  const map = useMap();

  const { zoomTo } = useMapActions();

  useEffect(() => {
    if (zoomTo) {
      const { lat, lng, level } = zoomTo;

      map.flyTo(
        {
          lat,
          lng,
        },
        level,
      );
    }
  }, [zoomTo]);

  return null;
}
