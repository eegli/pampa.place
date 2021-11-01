import Tarea from '@turf/area';
import Tbbox from '@turf/bbox';
import TbboxPolygon from '@turf/bbox-polygon';
import Tcenter from '@turf/center';
import { FeatureCollection, MultiPolygon, Polygon } from '@turf/helpers';
import { nanoid } from 'nanoid';
import { MapIdCollection, Maps } from '../types';

export function computeMapData<
  P extends Record<string, string>,
  T extends FeatureCollection<Polygon | MultiPolygon, P> = any
>(m: T): Maps {
  return m.features.reduce((acc, curr) => {
    const bb = Tbbox(curr);
    const bbPoly = TbboxPolygon(bb);
    const center = Tcenter(curr.geometry).geometry.coordinates;

    const properties = {
      name: '',
    };

    // Narrow down type
    if (curr.properties.NAME_LATN) {
      properties.name = curr.properties.NAME_LATN;
    } else if (curr.properties.name) {
      properties.name = curr.properties.name;
    } else {
      properties.name = 'unknown';
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
  }, [] as MapIdCollection);

  return ids.sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));
}
