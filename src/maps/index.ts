import {generateMapData} from './helpers/generator';

export const MAPS = generateMapData(
  {
    collection: require('maps/ch-cantons.json'),
    category: 'Swiss Cantons',
  },
  {
    collection: require('maps/us-states.json'),
    category: 'US States',
  },
  {
    collection: require('maps/countries.json'),
    category: 'Countries',
  }
);
