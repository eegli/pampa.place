import Tarea from '@turf/area';
import Tbbox from '@turf/bbox';
import TbboxPolygon from '@turf/bbox-polygon';
import {GeoJSONValidator} from '../types';

export const validateAndComputeGeoJSON: GeoJSONValidator = (
  feat,
  category,
  transformer
) => {
  try {
    // Only GeoJSON features "with an area" are allowed in this
    // game - No Points, LineStrings, etc.

    if (!feat.geometry.type.match(/(MultiPolygon|Polygon)$/gi)) {
      throw new Error(
        `Feature "${feat.properties.name}" (category "${category}") is not a Polygon or MultiPolygon.`
      );
    }

    if (!feat.properties.name) {
      throw new Error(
        `Feature "${feat.properties.name}" (category "${category}") does not have a "name" property.`
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
