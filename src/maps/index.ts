import {generateMapData} from './helpers/generator';

export const MAPS = generateMapData(
  {
    collection: require('geojson/che-cantons.json'),
    category: 'Switzerland',
  },
  {
    collection: require('geojson/usa-states.json'),
    category: 'USA',
  }
);
