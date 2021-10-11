import * as turf from '@turf/turf';
import {
  BBox,
  Feature,
  FeatureCollection,
  MultiPolygon,
  Polygon,
} from '@turf/turf';
import _countries from '../../data/world_2.json';
import _custom from '../../maps';

if (!Object.keys(_custom).length) {
  throw new Error('No maps found! Provide at least one custom map');
}

export type LatLngLiteral = { lat: number; lng: number };

// All maps need to be a polygon feature collection
type Properties = {
  name: string;
};
// Custom map input
export type CustomMaps = FeatureCollection<Polygon, Properties>[];

// Full map properties with additional data
export type FullMapData = {
  type: 'custom' | 'country';
  computed: {
    // Area in km^2
    area: number;
    // Not needed for now
    center: LatLngLiteral;
    // Used to generate a random point
    bb: BBox;
    // Poly bounding box: SW SE NE NW
    bbLiteral: Record<'NE' | 'SE' | 'SW' | 'NW', LatLngLiteral>;
  };
  // Base can be used directly with google maps
  geo: Feature<Polygon | MultiPolygon, Properties>;
};

export type MapConfig = Record<string, FullMapData>;

const countries = _countries as FeatureCollection<
  Polygon | MultiPolygon,
  Properties
>;

export const countryMaps = countries.features.reduce((acc, curr) => {
  const bb = turf.bbox(curr);
  const bbPoly = turf.bboxPolygon(bb);
  const center = turf.center(curr.geometry).geometry.coordinates;

  acc[curr.properties.name] = {
    geo: curr,
    type: 'country',
    computed: {
      area: turf.area(curr.geometry) * 1e-6,
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
}, <MapConfig>{});

export const customMaps = _custom.reduce((acc, curr) => {
  const bb = turf.bbox(curr);
  const bbPoly = turf.bboxPolygon(bb);
  const center = turf.center(curr.features[0]).geometry.coordinates;

  acc[curr.features[0].properties.name] = {
    geo: curr.features[0],
    type: 'custom',
    computed: {
      area: turf.area(curr) * 1e-6,
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

  return acc;
}, <MapConfig>{});

export const MAPS = { ...customMaps, ...countryMaps };

export const CUSTOM_MAP_IDS = [...Object.keys(customMaps).sort()];
export const COUNTRY_MAP_IDS = [...Object.keys(countryMaps).sort()];
