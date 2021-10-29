import Tarea from '@turf/area';
import Tbbox from '@turf/bbox';
import TbboxPolygon from '@turf/bbox-polygon';
import Tcenter from '@turf/center';
import {
  BBox,
  Feature,
  FeatureCollection,
  MultiPolygon,
  Polygon,
} from '@turf/helpers';
import { nanoid } from 'nanoid';
import _defaults from '../../data/NUTS_RG_03M_2021_4326_SUI.json';
import _customs from '../../maps';

export type LatLngLiteral = { lat: number; lng: number };

type Properties = {
  name: string;
  type: 'custom' | 'default';
};

// Custom map input
export type CustomMaps = FeatureCollection<Polygon, Properties>[];

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

type EUMapProperties = {
  CNTR_CODE: string;
  NAME_LATN: string;
  NUTS_ID: string;
  FID: string;
};

export const defaults = _defaults as FeatureCollection<
  Polygon | MultiPolygon,
  EUMapProperties
>;

/* 
Any map can be created here, it only needs to fit the MapConfig type.
This version uses Swiss maps as default maps.
*/

export const defaultMaps = defaults.features.reduce((acc, curr) => {
  const bb = Tbbox(curr);
  const bbPoly = TbboxPolygon(bb);
  const center = Tcenter(curr.geometry).geometry.coordinates;

  // Use an ID in order to avoid collisions with custom and default maps
  acc[nanoid(12)] = {
    geo: {
      ...curr,
      properties: { name: curr.properties.NAME_LATN, type: 'default' },
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

export const customMaps = _customs.reduce((acc, curr) => {
  const bb = Tbbox(curr);
  const bbPoly = TbboxPolygon(bb);
  const center = Tcenter(curr.features[0]).geometry.coordinates;

  acc[nanoid(12)] = {
    geo: curr.features[0],
    computed: {
      area: Tarea(curr) * 1e-6,
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

export type MapCollectionId = {
  name: string;
  id: string;
};

// Default maps are spread in before custom maps
export const MAPS = { ...defaultMaps, ...customMaps };

// Sort the array of custom map ids at the very end
const sortIdxCustom = Object.keys(MAPS).length - 1;
// Sort the default map array at the correct index
const sortIdxDefault = Object.keys(defaultMaps).length - 1;

export const MAP_IDS = Object.entries(MAPS).reduce(
  (acc, [id, data], idx) => {
    if (data.geo.properties.type === 'custom') {
      acc.custom.push({ name: data.geo.properties.name, id });

      // Sort when last element is added
      if (idx === sortIdxCustom) {
        acc.custom.sort((a, b) =>
          a.name > b.name ? 1 : a.name < b.name ? -1 : 0
        );
      }
    } else {
      acc.default.push({ name: data.geo.properties.name, id });

      // Sort when last element is added
      if (idx === sortIdxDefault) {
        acc.default.sort((a, b) =>
          a.name > b.name ? 1 : a.name < b.name ? -1 : 0
        );
      }
    }

    return acc;
  },
  { custom: [], default: [] } as {
    custom: MapCollectionId[];
    default: MapCollectionId[];
  }
);
