import {Constants} from '../constants';
import {LocalMapEnhancer, MapData} from '../types';

export const addLocalMaps: LocalMapEnhancer = maps => {
  if (typeof window !== 'undefined') {
    const local =
      window.localStorage.getItem(Constants.LOCALSTORAGE_MAPS_KEY) || '{}';
    const parsedMaps: Record<string, MapData> = JSON.parse(local);

    Object.values(parsedMaps).forEach(map => {
      try {
        maps.set(map.properties.id, map);
      } catch (e) {
        console.error(`Failed to add local map ${map}, ${e}`);
      }
    });
  }

  return maps;
};
