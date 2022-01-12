import Tarea from '@turf/area';
import Tbbox from '@turf/bbox';
import TbboxPolygon from '@turf/bbox-polygon';
import {GeoJSONValidator, MapData, MapDataGenerator} from '../types';

export const validateAndComputeGeoJSON: GeoJSONValidator = (
  feat,
  category,
  transformer
): MapData => {
  try {
    // Only GeoJSON features "with an area" are allowed in this
    // game - No Points, LineStrings, etc.
    if (!['Polygon', 'MultiPolygon'].includes(feat.geometry.type)) {
      throw new Error(
        `Feature "${feat.properties.name}" (category "${category}") is not a Polygon or MultiPolygon.`
      );
    }

    // Skip maps with no name property
    if (!feat.properties.name) {
      throw new Error(
        `Warning! Feature "${feat.properties.name}" (category "${category}") does not have a "name" property.`
      );
    }

    const bb = Tbbox(feat);
    const bbPoly = TbboxPolygon(bb);

    // Maps with the same name AND category will overwrite each other!
    const mapId = `${category}-${feat.properties.name}`
      .replace(/\s/g, '-')
      .toLowerCase();

    if (transformer) {
      transformer(feat.properties);
    }
    return {
      type: feat.type,
      geometry: feat.geometry,
      properties: {
        id: mapId,
        name: feat.properties.name,
        category: category,
        area: Tarea(feat.geometry) * 1e-6,
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
  } catch (e) {
    throw new Error(
      `Failed to compute map data for feature with properties "${JSON.stringify(
        {name: feat.properties, category},
        null,
        2
      )}".\n${e}`
    );
  }
};

export const createMapData: MapDataGenerator = (...inputs) => {
  const mapData = new Map<string, MapData>();
  for (const input of inputs) {
    const {map, category, transformer} = input;
    for (const feature of map.features) {
      const data = validateAndComputeGeoJSON(feature, category, transformer);
      mapData.set(data.properties.id, data);
    }
  }
  return mapData;
};
