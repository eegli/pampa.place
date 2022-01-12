import {Constants} from './constants';
import {createMapData} from './helpers/creator';
import {MapDataCollection, PropertyTransformer} from './types';

const swissMapsTransformer: PropertyTransformer = p => {
  if (p.name.includes('/')) {
    p.name = p.name.split('/')[0];
  }
};

export const MAPS: MapDataCollection = createMapData(
  {
    map: require('geojson/switzerland.json'),
    category: 'switzerland',
    transformer: swissMapsTransformer,
  },
  {map: require('geojson/alps.json'), category: 'alps'},
  {map: require('geojson/usa.json'), category: 'usa'}
);

if (typeof window !== 'undefined') {
  const local = window.localStorage.getItem(Constants.LOCALSTORAGE_MAPS_KEY);
  if (Array.isArray(local) && local.length) {
    const maps = JSON.parse(local);
    for (const map of maps) {
      MAPS.set(map.id, map);
    }
  }
}

export const defaultMaps = Array.from(MAPS.values()).map(m => ({
  ...m.properties,
}));
