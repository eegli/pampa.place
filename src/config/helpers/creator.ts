import Tarea from '@turf/area';
import Tbbox from '@turf/bbox';
import TbboxPolygon from '@turf/bbox-polygon';
import { FeatureCollection, MultiPolygon, Polygon } from '@turf/helpers';
import { nanoid } from 'nanoid';
import {
  BaseMapProperties,
  MapDataCollection,
  MapIdCollection,
} from '../types';

export function computeMapData<
  T extends FeatureCollection<Polygon | MultiPolygon, BaseMapProperties>
>(m: T, category: string): MapDataCollection {
  return m.features.reduce((acc, curr) => {
    const bb = Tbbox(curr);
    const bbPoly = TbboxPolygon(bb);

    delete curr.id;

    // Use an ID in order to avoid collisions between custom and Swiss maps
    acc[nanoid(12)] = {
      feature: {
        ...curr,
        properties: {
          name: curr.properties.name,
          category: category,
        },
      },

      area: Tarea(curr.geometry) * 1e-6,
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
    };
    acc;
    return acc;
  }, {} as MapDataCollection);
}

export function computeMapIds(m: MapDataCollection) {
  const ids = Object.entries(m).reduce((acc, [mapId, data]) => {
    acc.push({
      name: data.feature.properties.name,
      category: data.feature.properties.category,
      id: mapId,
    });

    return acc;
  }, [] as MapIdCollection);

  return ids.sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));
}