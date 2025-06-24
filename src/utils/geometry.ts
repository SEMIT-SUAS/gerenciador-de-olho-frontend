import type { LatLngExpression } from 'leaflet';


export function getConvexHull(points: { lat: number, lon: number }[]): LatLngExpression[] {
    points.sort((a, b) => a.lon - b.lon || a.lat - b.lat);
    const lower: { lat: number, lon: number }[] = [];
    const upper: { lat: number, lon: number }[] = [];
    const crossProduct = (o: any, a: any, b: any) => (a.lon - o.lon) * (b.lat - o.lat) - (a.lat - o.lat) * (b.lon - o.lon);
    for (const point of points) {
        while (lower.length >= 2 && crossProduct(lower[lower.length - 2], lower[lower.length - 1], point) <= 0) lower.pop();
        lower.push(point);
    }
    for (let i = points.length - 1; i >= 0; i--) {
        const point = points[i];
        while (upper.length >= 2 && crossProduct(upper[upper.length - 2], upper[upper.length - 1], point) <= 0) upper.pop();
        upper.push(point);
    }
    upper.pop();
    lower.pop();
    const hull = lower.concat(upper);
    return hull.map(p => [p.lat, p.lon]);
}
