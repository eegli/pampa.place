import {FeatureParser, UserGeoJSONParser} from '@/config/types';
import Tarea from '@turf/area';
import Tbbox from '@turf/bbox';
import TbboxPolygon from '@turf/bbox-polygon';

export const parseGeoJSONFeature: FeatureParser = (feature, category) => {
  try {
    // Only GeoJSON features "with an area" are allowed in this
    // game - No Points, LineStrings, etc.

    if (!feature.properties?.name) {
      throw new Error(
        `One of the Features (category "${category}") does not have a "name" property.`
      );
    }

    if (!feature.geometry.type.match(/(MultiPolygon|Polygon)$/gi)) {
      throw new Error(
        `Feature "${feature.properties.name}" (category "${category}") is not a Polygon or MultiPolygon.`
      );
    }

    const bb = Tbbox(feature);
    const bbPoly = TbboxPolygon(bb);

    // Maps with the same name AND category will overwrite each other!
    const mapId = `${category}-${feature.properties.name}`
      .replace(/\s/g, '-')
      .toLowerCase();

    return {
      type: feature.type,
      geometry: feature.geometry,
      properties: {
        id: mapId,
        name: feature.properties.name,
        category: category,
        area: Tarea(feature.geometry) * 1e-6,
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
    throw new Error(`Failed to compute map data.\n${e}`);
  }
};

// Parse maps that users input in /my-maps. This throws if the input
// is invalid, so it should be wrapped in try/catch whenever user map
// input is parsed. For user input maps, only the first feature in a
// collection is considered!
export const parseUserGeoJSON: UserGeoJSONParser = (raw, name, category) => {
  let parsed = JSON.parse(raw);
  if (Array.isArray(parsed.features)) {
    parsed = parsed.features[0];
  }
  parsed.properties = {name};
  return parseGeoJSONFeature(parsed, category);
};
