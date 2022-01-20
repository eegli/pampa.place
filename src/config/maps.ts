import {generateMapData} from './helpers/generator';
import {PropertyTransformer} from './types';

const swissMapsTransformer: PropertyTransformer = p => {
  if (p.name.includes('/')) {
    p.name = p.name.split('/')[0];
  }
};

export const MAPS = generateMapData(
  {
    map: require('geojson/switzerland.json'),
    category: 'switzerland',
    transformer: swissMapsTransformer,
  },
  {
    map: require('geojson/us-states.json'),
    category: 'usa',
  },
  {
    map: require('geojson/america.json'),
    category: 'usa',
  }
);
