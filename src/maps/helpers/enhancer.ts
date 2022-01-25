import {Constants} from '@/config/constants';
import {LocalMapEnhancer, LocalStorageMaps} from '@/config/types';
import {parseGeoJSONFeature} from './parser';

export const addLocalMaps: LocalMapEnhancer = maps => {
  if (typeof window !== 'undefined') {
    const local =
      window.localStorage.getItem(Constants.LOCALSTORAGE_MAPS_KEY) || '{}';
    const parsedMaps: LocalStorageMaps = JSON.parse(local);

    Object.values(parsedMaps).forEach(map => {
      try {
        // Recompute local properties in case anything has changed
        const validatedMap = parseGeoJSONFeature(map, 'local');
        maps.set(validatedMap.properties.id, map);
      } catch (e) {
        console.error(`Failed to add local map ${map}, ${e}`);
      }
    });
  }

  return maps;
};
