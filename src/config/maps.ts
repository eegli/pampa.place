import {Constants} from './constants';
import {createMapData} from './helpers/creator';
import {MapDataCollection, PropertyTransformer} from './types';

const swissMapsTransformer: PropertyTransformer = p => {
  if (p.name.includes('/')) {
    p.name = p.name.split('/')[0];
  }
};

const MAPS: MapDataCollection = createMapData(
  {
    map: require('geojson/switzerland.json'),
    category: 'switzerland',
    transformer: swissMapsTransformer,
  },
  {map: require('geojson/alps.json'), category: 'alps'}
);

if (typeof window !== 'undefined') {
  const local =
    window.localStorage.getItem(Constants.LOCALSTORAGE_MAPS_KEY) || '[]';
  const parsedMaps = JSON.parse(local);
  if (Array.isArray(parsedMaps) && parsedMaps.length) {
    for (const map of parsedMaps) {
      try {
        MAPS.set(map.properties.id, map);
      } catch (e) {
        console.error(`Failed to add local map ${map}, ${e}`);
      }
    }
  }
}

export const defaultMaps = Array.from(MAPS.values()).map(m => ({
  ...m.properties,
}));

// The export needs to happen last so the maps are enriched with local
// maps
export {MAPS};
