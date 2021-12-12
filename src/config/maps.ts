import {computeMapData, computeMapIds} from './helpers/creator';
import {MapDataCollection, MapIdCollection, PropertyTransformer} from './types';

const swissMapsTransformer: PropertyTransformer = p => {
  if (p.name.includes('/')) {
    p.name = p.name.split('/')[0];
  }
};

export const MAPS: MapDataCollection = computeMapData(
  {
    map: require('geojson/switzerland.json'),
    category: 'switzerland',
    transformer: swissMapsTransformer,
  },
  {map: require('geojson/alps.json'), category: 'alps'}
);

export const MAP_IDS: MapIdCollection = computeMapIds(MAPS);
export const apiData = {
  MAPS,
  MAP_IDS,
};
