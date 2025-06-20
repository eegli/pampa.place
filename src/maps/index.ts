import {generateMapData} from './helpers/generator';

export const MAPS = generateMapData(
  {
    collection: require('maps/worldwide/world.json'),
    category: 'Worldwide',
  },
  {
    collection: require('maps/regional/che-cantons.json'),
    category: 'Switzerland',
  },
  {
    collection: require('maps/regional/usa-states.json'),
    category: 'USA',
  }
);
