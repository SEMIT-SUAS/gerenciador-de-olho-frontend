import { useEffect, useRef } from 'react';
import { useLocation, type Location } from 'react-router-dom';

export default function usePreviousLocation(): Location | null {
  const location = useLocation();
  const previousLocationRef = useRef<Location | null>(null);

  useEffect(() => {
    previousLocationRef.current = location;
  }, [location]);

  return previousLocationRef.current;
}
