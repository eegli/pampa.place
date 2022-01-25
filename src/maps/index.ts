import {generateMapData} from './helpers/generator';

export const MAPS = generateMapData(
  {
    collection: require('geojson/switzerland.json'),
    category: 'switzerland',
  },
  {
    collection: require('geojson/us-states.json'),
    category: 'usa',
  },
  {
    collection: require('geojson/america.json'),
    category: 'usa',
  }
);
