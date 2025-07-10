import type { LatLngExpression } from 'leaflet';

type Point = { lat: number; lon: number };

function crossProduct(o: Point, a: Point, b: Point): number {
  return (a.lon - o.lon) * (b.lat - o.lat) - (a.lat - o.lat) * (b.lon - o.lon);
}

export function getConvexHull(points: Point[]): LatLngExpression[] {
  if (points.length < 3) {
    return points.map((p) => [p.lat, p.lon]);
  }

  const sortedPoints = [...points].sort(
    (a, b) => a.lon - b.lon || a.lat - b.lat,
  );

  const lower: Point[] = [];
  for (const point of sortedPoints) {
    while (
      lower.length >= 2 &&
      crossProduct(lower[lower.length - 2], lower[lower.length - 1], point) <= 0
    ) {
      lower.pop();
    }
    lower.push(point);
  }

  const upper: Point[] = [];
  for (let i = sortedPoints.length - 1; i >= 0; i--) {
    const point = sortedPoints[i];
    while (
      upper.length >= 2 &&
      crossProduct(upper[upper.length - 2], upper[upper.length - 1], point) <= 0
    ) {
      upper.pop();
    }
    upper.push(point);
  }

  upper.pop();
  lower.pop();

  const hull = lower.concat(upper);
  return hull.map((p) => [p.lat, p.lon]);
}

export function getPolygonoCenter(
  coordinates: LatLngExpression[],
): [number, number] {
  if (!coordinates || coordinates.length === 0) {
    return [0, 0];
  }

  const totalLat = coordinates.reduce((sum, coord) => {
    return sum + (Array.isArray(coord) ? coord[0] : coord.lat);
  }, 0);

  const totalLng = coordinates.reduce((sum, coord) => {
    const longitude = Array.isArray(coord)
      ? coord[1]
      : 'lng' in coord
      ? (coord as any).lng
      : (coord as any).lon;
    return sum + longitude;
  }, 0);

  return [totalLat / coordinates.length, totalLng / coordinates.length];
}
