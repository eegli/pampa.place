import customMapData from '../../maps/custom.json';
import swissMapData from '../../maps/switzerland.json';
import {computeMapData, computeMapIds} from './helpers/creator';
import {InputMapData, MapDataCollection, MapIdCollection} from './types';

const maps: MapDataCollection[] = [
  computeMapData(swissMapData as InputMapData, 'switzerland'),
  computeMapData(customMapData as InputMapData, 'custom'),
];

export const MAPS: MapDataCollection = Object.assign({}, ...maps);
export const MAP_IDS: MapIdCollection = computeMapIds(MAPS);
export const apiData = {
  MAPS,
  MAP_IDS,
};
