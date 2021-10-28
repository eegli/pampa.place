import * as turf from '@turf/turf';
import {
  BBox,
  Feature,
  FeatureCollection,
  MultiPolygon,
  Polygon,
} from '@turf/turf';
import { nanoid } from 'nanoid';
import _europe from '../../data/NUTS_RG_03M_2021_4326.json';
import _custom from '../../maps';

export type LatLngLiteral = { lat: number; lng: number };

export type MapType = 'custom' | 'default';
type Properties = {
  name: string;
  type: MapType;
};

// Custom map input
export type CustomMaps = FeatureCollection<Polygon, Properties>[];

type EUMapProperties = {
  CNTR_CODE: string;
  NAME_LATN: string;
  NUTS_ID: string;
  FID: string;
};

// Full map properties with additional data
export type MapData = {
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

export type Maps = Record<string, MapData>;

const europe = _europe as FeatureCollection<
  Polygon | MultiPolygon,
  EUMapProperties
>;

/* 
Any map can be created here, it only needs to fit the MapConfig type
*/
const swissMaps = europe.features.reduce((acc, curr) => {
  if (curr.properties.CNTR_CODE !== 'CH') {
    return acc;
  }
  const bb = turf.bbox(curr);
  const bbPoly = turf.bboxPolygon(bb);
  const center = turf.center(curr.geometry).geometry.coordinates;

  let key = curr.properties.NAME_LATN;

  if (curr.properties.NAME_LATN === 'Schweiz/Suisse/Svizzera') {
    key = 'Schweiz';
  }

  const id = nanoid(8);

  acc[key] = {
    geo: { ...curr, properties: { name: key, type: 'default' } },
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
}, {} as Maps);

const customMaps = _custom.reduce((acc, curr) => {
  const bb = turf.bbox(curr);
  const bbPoly = turf.bboxPolygon(bb);
  const center = turf.center(curr.features[0]).geometry.coordinates;

  acc[curr.features[0].properties.name] = {
    geo: curr.features[0],
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
}, {} as Maps);

export type MapCollection<T = Maps> = {
  type: string;
  data: T;
};

export const MAPS = { ...swissMaps, ...customMaps };

export const CUSTOM_MAP_IDS = Object.keys(customMaps).sort();
export const DEFAULT_MAP_IDS = Object.keys(swissMaps).sort();
