import {useLocalStorage} from 'usehooks-ts';
import {LocalStorageMaps, MapData} from '@/config/types';
import {Constants} from '@/config/constants';

export function useLocalStorageMaps() {
  const [localMaps, setLocalMaps] = useLocalStorage<LocalStorageMaps>(
    Constants.LOCALSTORAGE_MAPS_KEY,
    {}
  );

  function addMap(mapData: MapData) {
    const mapId = mapData.properties.id;
    setLocalMaps({...localMaps, [mapId]: mapData});
  }

  function removeMap(mapId: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {[mapId]: _delete, ...otherMaps} = localMaps;
    setLocalMaps(otherMaps);
  }

  return [localMaps, addMap, removeMap] as const;
}
