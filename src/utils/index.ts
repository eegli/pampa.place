// Area in square kilometers, distance in meters
import { LatLngLiteral, MapData } from '@config';
import * as turf from '@turf/turf';

export function randomPointInMap(map: MapData): LatLngLiteral {
  while (true) {
    const random = turf.randomPoint(50, { bbox: map.computed.bb });

    const ptsWithin = turf.pointsWithinPolygon(random, map.base);
    if (ptsWithin.features.length) {
      const pt = ptsWithin.features[0].geometry.coordinates;
      return { lng: pt[0], lat: pt[1] };
    }
  }
}

// https://www.desmos.com/calculator/xlzbhq4xm0
export function calculateScore(area: number, dist: number) {
  if (dist < 0) return 0;
  const c = Math.sqrt(dist * area) + area;
  const score = 5000 * Math.E ** -(dist / c);

  return Math.round(score);
}
// Returns distance between two points in kilometers

export function calculateDistance(
  p1: LatLngLiteral,
  p2: LatLngLiteral,
  units: turf.Units = 'meters'
) {
  const from = turf.point([p1.lng, p1.lat]);
  const to = turf.point([p2.lng, p2.lat]);
  return turf.distance(from, to, { units });
}
// Formats distance
export function formatDist(meter: number, toFixed = 1) {
  if (meter < 0) return '-';
  if (meter < 1000) {
    return meter.toFixed(toFixed) + ' m';
  }
  return (meter / 1000).toFixed(toFixed) + ' km';
}

export function max(num: number, limit: number) {
  return num >= limit ? limit : num;
}

export function id(): string {
  const array = new Uint32Array(8);
  window.crypto.getRandomValues(array);
  let str = '';
  for (let i = 0; i < array.length; i++) {
    str += (i < 2 || i > 5 ? '' : '-') + array[i].toString(16).slice(-4);
  }
  return str;
}
