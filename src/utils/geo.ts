import {
  EUMapProperties,
  LatLngLiteral,
  MapCollectionId,
  Maps,
  Properties,
} from '@/config/maps';
import Tarea from '@turf/area';
import Tbbox from '@turf/bbox';
import TbboxPolygon from '@turf/bbox-polygon';
import Tcenter from '@turf/center';
import Tdistance from '@turf/distance';
import {
  BBox,
  FeatureCollection,
  MultiPolygon,
  point,
  Polygon,
  Units,
} from '@turf/helpers';
import TpointsWithinPolygon from '@turf/points-within-polygon';
import { randomPoint as TrandomPoint } from '@turf/random';
import { nanoid } from 'nanoid';
export function randomPointInMap(
  bbox: BBox,
  polygon: Parameters<typeof TpointsWithinPolygon>[1]
): LatLngLiteral {
  do {
    const random = TrandomPoint(20, { bbox });
    const ptsWithin = TpointsWithinPolygon(random, polygon);
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
  units: Units = 'meters'
): number {
  const from = point([p1.lng, p1.lat]);
  const to = point([p2.lng, p2.lat]);
  return Tdistance(from, to, { units });
}

export function computeMapData<
  T extends FeatureCollection<
    Polygon | MultiPolygon,
    EUMapProperties | Properties
  >
>(m: T): Maps {
  return m.features.reduce((acc, curr) => {
    const bb = Tbbox(curr);
    const bbPoly = TbboxPolygon(bb);
    const center = Tcenter(curr.geometry).geometry.coordinates;

    const properties: Properties = {
      name: '',
    };

    // Narrow down type
    if ('NAME_LATN' in curr.properties) {
      properties.name = curr.properties.NAME_LATN;
    } else {
      properties.name = curr.properties.name;
    }

    // Use an ID in order to avoid collisions between custom and default maps
    acc[nanoid(12)] = {
      geo: {
        ...curr,
        properties,
      },
      computed: {
        area: Tarea(curr.geometry) * 1e-6,
        center: { lng: center[0], lat: center[1] },
        bb,
        bbLiteral: {
          SW: {
            lng: bbPoly.geometry.coordinates[0][0][0],
            lat: bbPoly.geometry.coordinates[0][0][1],
          },
          SE: {
            lng: bbPoly.geometry.coordinates[0][1][0],
            lat: bbPoly.geometry.coordinates[0][1][1],
          },
          NE: {
            lng: bbPoly.geometry.coordinates[0][2][0],
            lat: bbPoly.geometry.coordinates[0][2][1],
          },
          NW: {
            lng: bbPoly.geometry.coordinates[0][3][0],
            lat: bbPoly.geometry.coordinates[0][3][1],
          },
        },
      },
    };
    acc;
    return acc;
  }, {} as Maps);
}

export function computeMapIds(m: Maps) {
  const ids = Object.entries(m).reduce((acc, [id, data]) => {
    acc.push({ name: data.geo.properties.name, id });

    return acc;
  }, [] as MapCollectionId[]);

  return ids.sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));
}
