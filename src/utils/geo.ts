import { LatLngLiteral, MapData } from '@/config/maps';
import * as turf from '@turf/turf';

export function randomPointInMap(mapData: MapData): LatLngLiteral {
  do {
    const random = turf.randomPoint(20, { bbox: mapData.computed.bb });
    const ptsWithin = turf.pointsWithinPolygon(random, mapData.geo);
    if (ptsWithin.features.length) {
      const pt = ptsWithin.features[0].geometry.coordinates;
      return { lng: pt[0], lat: pt[1] };
    }
  } while (true);
}
// Area in square kilometers, distance in meters
// https://www.desmos.com/calculator/xlzbhq4xm0
export function calcScore(area: number, dist: number): number {
  if (dist < 0) return 0;
  const c = Math.log(area * dist + 1) * Math.sqrt(area * dist);
  const score = 5000 * Math.E ** -(dist / c);
  console.log(score);
  return Math.round(score);
}
// Returns distance between two points in kilometers

export function calcDist(
  p1: LatLngLiteral,
  p2: LatLngLiteral,
  units: turf.Units = 'meters'
): number {
  const from = turf.point([p1.lng, p1.lat]);
  const to = turf.point([p2.lng, p2.lat]);
  return turf.distance(from, to, { units });
}
