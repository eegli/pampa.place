import customMapData from '../../maps/custom.json';
import defaultMapData from '../../maps/switzerland.json';
import {computeMapData, computeMapIds} from './helpers/creator';
import {
  MapDataCollection,
  MapFeatureCollection,
  MapIdCollection,
} from './types';

/* Importing a GeoJSON data set and computing the required properties.
Here, the default maps are Swiss cantons and regions */
const swissMaps: MapDataCollection = computeMapData(
  defaultMapData as MapFeatureCollection,
  'switzerland'
);

/* Custom maps can easily be added and don't need to be loaded from a
GeoJSON file */
const customMaps: MapDataCollection = computeMapData(
  customMapData as MapFeatureCollection,
  'custom'
);

export const MAPS: MapDataCollection = {...swissMaps, ...customMaps};

export const MAP_IDS: MapIdCollection = computeMapIds(MAPS);

export const apiData = {
  MAPS,
  MAP_IDS,
};
