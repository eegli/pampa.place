import {MapData, MapGenerator, MapProperties} from '../types';
import {addLocalMaps} from './enhancer';
import {validateAndComputeGeoJSON} from './validator';

export const generateMapData: MapGenerator = (...inputs) => {
  let mapData = new Map<string, MapData>();
  // Add local maps if there are
  mapData = addLocalMaps(mapData);
  const mapDataProperties: MapProperties[] = [];
  for (const input of inputs) {
    const {map, category, transformer} = input;
    for (const feature of map.features) {
      const data = validateAndComputeGeoJSON(feature, category, transformer);
      mapData.set(data.properties.id, data);
      mapDataProperties.push(data.properties);
    }
  }
  return {
    MAPS: addLocalMaps(mapData),
    PROPERTIES: mapDataProperties,
  };
};
