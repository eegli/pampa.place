import defaultMapData from '../../data/NUTS_RG_03M_2021_4326_SUI.json';
import customMapData from '../../maps';
import { computeMapData, computeMapIds } from './helpers';
import { EUMapProperties, MapCollection, MapIdCollection, Maps } from './types';

const defaultMaps = computeMapData(
  defaultMapData as MapCollection<EUMapProperties>
);
const customMaps = computeMapData(customMapData);

export const MAPS: Maps = { ...defaultMaps, ...customMaps };

export const CUSTOM_MAP_IDS: MapIdCollection = computeMapIds(customMaps);
export const DEFAULT_MAP_IDS: MapIdCollection = computeMapIds(defaultMaps);

export const apiData = {
  defaultMaps,
  customMaps,
  CUSTOM_MAP_IDS,
  DEFAULT_MAP_IDS,
};
