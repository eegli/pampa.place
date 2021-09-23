import { LatLngLiteral, MapData } from '@config';
import * as turf from '@turf/turf';

export type OrNull<T> = T | null;

export function randomPointInMap(map: MapData): LatLngLiteral {
  while (true) {
    const random = turf.randomPoint(20, { bbox: map.computed.bb });

    const ptsWithin = turf.pointsWithinPolygon(random, map.base);
    if (ptsWithin.features.length) {
      const pt = ptsWithin.features[0].geometry.coordinates;
      return { lng: pt[0], lat: pt[1] };
    }
  }
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
// Formats distance
export function formatDist(meter: number, toFixed = 1): string {
  if (meter < 0) return '-';
  if (meter < 1000) {
    return meter.toFixed(toFixed) + ' m';
  }
  return (meter / 1000).toFixed(toFixed) + ' km';
}

export function max(num: number, limit: number): number {
  return num >= limit ? num : limit;
}

export async function sha256(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
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
