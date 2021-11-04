import defaultMapData from '../../data/NUTS_RG_03M_2021_4326_SUI.json';
import customMapData from '../../maps';
import { computeMapData, computeMapIds } from './helpers';
import {
  MapDataCollection,
  MapFeatureCollection,
  MapIdCollection,
  SwissMapProperties,
} from './types';

/* Importing a GeoJSON data set and computing the required properties.
Here, the default maps are Swiss cantons and regions */
const swissMaps: MapDataCollection = computeMapData(
  defaultMapData as MapFeatureCollection<SwissMapProperties>
);

/* Custom maps can easily be added and don't need to be loaded from a
GeoJSON file */
const customMaps: MapDataCollection = computeMapData(customMapData);

export const MAPS: MapDataCollection = { ...swissMaps, ...customMaps };

export const MAP_IDS: MapIdCollection = computeMapIds(MAPS);

export const apiData = {
  MAPS,
  MAP_IDS,
};
