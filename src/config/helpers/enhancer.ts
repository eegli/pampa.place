import {Constants} from '../constants';
import {LocalMapEnhancer, LocalStorageMaps} from '../types';
import {validateAndComputeGeoJSON} from './validator';

export const addLocalMaps: LocalMapEnhancer = maps => {
  if (typeof window !== 'undefined') {
    const local =
      window.localStorage.getItem(Constants.LOCALSTORAGE_MAPS_KEY) || '{}';
    const parsedMaps: LocalStorageMaps = JSON.parse(local);

    Object.values(parsedMaps).forEach(map => {
      try {
        // Recompute local properties in case anything has changed
        const validatedMap = validateAndComputeGeoJSON(map, 'local');
        maps.set(validatedMap.properties.id, map);
      } catch (e) {
        console.error(`Failed to add local map ${map}, ${e}`);
      }
    });
  }

  return maps;
};
