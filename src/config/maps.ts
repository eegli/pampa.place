import customMapData from '../../maps/custom.json';
import swissMapData from '../../maps/switzerland.json';
import {computeMapData, computeMapIds} from './helpers/creator';
import {
  InputMapData,
  MapDataCollection,
  MapIdCollection,
  PropertyTransformer,
} from './types';

const swissMapsTransformer: PropertyTransformer = p => {
  if (p.name.includes('/')) {
    p.name = p.name.split('/')[0];
  }
};

export const MAPS: MapDataCollection = computeMapData(
  {
    map: swissMapData as InputMapData,
    category: 'switzerland',
    transformer: swissMapsTransformer,
  },
  {map: customMapData as InputMapData, category: 'custom'}
);

export const MAP_IDS: MapIdCollection = computeMapIds(MAPS);
export const apiData = {
  MAPS,
  MAP_IDS,
};
