import {LatLngLiteral} from '@/config/types';
import Tdistance from '@turf/distance';
import {BBox, MultiPolygon, point, Polygon, Units} from '@turf/helpers';
import TpointsWithinPolygon from '@turf/points-within-polygon';
import {randomPoint as TrandomPoint} from '@turf/random';

export function randomPointInMap(
  bbox: BBox,
  polygon: Polygon | MultiPolygon
): LatLngLiteral {
  do {
    const random = TrandomPoint(20, {bbox});
    const ptsWithin = TpointsWithinPolygon(random, polygon);
    if (ptsWithin.features.length) {
      const pt = ptsWithin.features[0].geometry.coordinates;
      return {lng: pt[0], lat: pt[1]};
    }
  } while (true);
}

// Area in square kilometers, distance in meters
// https://www.desmos.com/calculator/xlzbhq4xm0
export function calcScore(area: number, dist: number): number {
  if (dist < 0) return 0;
  const c = Math.log(area * dist + 1) * Math.sqrt(area * dist);
  const score = 5000 * Math.E ** -(dist / c);
  return Math.round(score);
}
// Returns distance between two points in kilometers

export function calcDist(
  p1: LatLngLiteral,
  p2: LatLngLiteral,
  units: Units = 'meters'
): number {
  const from = point([p1.lng, p1.lat]);
  const to = point([p2.lng, p2.lat]);
  return Tdistance(from, to, {units});
}
