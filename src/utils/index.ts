// Area in square kilometers, distance in meters
import { LatLngLiteral } from '@config';
import * as turf from '@turf/turf';

// https://www.desmos.com/calculator/xlzbhq4xm0
export function calculateScore(area: number, dist: number) {
  if (dist < 0) return 0;
  const c =
    Math.log(area + 1) * Math.sqrt(dist * area) + Math.log(dist ** 2 + 1);
  const score = 5000 * Math.E ** -(dist / c);

  return Math.round(score);
}
// Returns distance between two points in kilometers

export function calculateDistance(
  p1: LatLngLiteral,
  p2: LatLngLiteral,
  units: turf.Units = 'kilometers'
) {
  const from = turf.point([p1.lng, p1.lat]);
  const to = turf.point([p2.lng, p2.lat]);
  return turf.distance(from, to, { units });
}
// Formats distance
export function formatDist(km: number, toFixed = 1) {
  if (km < 0) return '-';
  if (km > 1000) {
    return (km / 1000).toFixed(toFixed) + ' m';
  }
  return km.toFixed(toFixed) + ' km';
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
