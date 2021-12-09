import Tarea from '@turf/area';
import Tbbox from '@turf/bbox';
import TbboxPolygon from '@turf/bbox-polygon';
import {MapDataCollection, MapDataGenerator, MapIdGenerator} from '../types';

export const computeMapData: MapDataGenerator = (...inputs) => {
  const maps = inputs.map(({map, category, transformer}) => {
    return map.features.reduce((acc, curr) => {
      try {
        // Only GeoJSON features "with an area" are allowed in this
        // game - No Points, LineStrings, etc.
        if (!['Polygon', 'MultiPolygon'].includes(curr.geometry.type)) {
          console.warn(
            `Warning! Feature "${curr.properties.name}" (category "${category}") is not a Polygon or MultiPolygon.`
          );
          return acc;
        }

        // Skip maps with no name property
        if (!curr.properties.name) {
          console.warn(
            `Warning! Feature "${curr.properties.name}" (category "${category}") does not have a "name" property.`
          );
          return acc;
        }

        const bb = Tbbox(curr);
        const bbPoly = TbboxPolygon(bb);

        // Maps with the same name AND category will overwrite themselves!
        const mapId = `${category}-${curr.properties.name}`
          .replace(/\s/g, '-')
          .toLowerCase();

        if (transformer) {
          transformer(curr.properties);
        }

        acc[mapId] = {
          feature: {
            ...curr,
            properties: {
              id: mapId,
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

        return acc;
      } catch (e) {
        throw new Error(
          `Failed to compute map data for feature with properties "${JSON.stringify(
            {name: curr.properties, category},
            null,
            2
          )}".\n${e}`
        );
      }
    }, {} as MapDataCollection);
  });
  return Object.assign({}, ...maps);
};

export const computeMapIds: MapIdGenerator = mapDataCollection => {
  return Object.values(mapDataCollection)
    .map(mapData => mapData.feature.properties)
    .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));
};
