import {
  BBox,
  Feature,
  FeatureCollection,
  MultiPolygon,
  Polygon,
} from '@turf/helpers';
import defaultMapData from '../../data/NUTS_RG_03M_2021_4326_SUI.json';
import customMapData from '../../maps';
import { computeMapData, computeMapIds } from '../utils/geo';

export type LatLngLiteral = { lat: number; lng: number };

// All maps eventually only need the name property
export type Properties = {
  name: string;
};

// Specific properties of the map data set of the EU
export type EUMapProperties = {
  CNTR_CODE: string;
  NAME_LATN: string;
  NUTS_ID: string;
  FID: string;
};

// Custom map input
export type CustomMaps = FeatureCollection<Polygon | MultiPolygon, Properties>;
type DefaultMaps = FeatureCollection<Polygon | MultiPolygon, EUMapProperties>;

// Full, computed map data
export type Maps = Record<
  string,
  {
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
  }
>;

export const defaultMaps: Maps = computeMapData(defaultMapData as DefaultMaps);
export const customMaps: Maps = computeMapData(customMapData);

export const MAPS: Maps = { ...defaultMaps, ...customMaps };

export type MapCollectionId = {
  name: string;
  id: string;
};

export const CUSTOM_MAP_IDS: MapCollectionId[] = computeMapIds(customMaps);
export const DEFAULT_MAP_IDS: MapCollectionId[] = computeMapIds(defaultMaps);
