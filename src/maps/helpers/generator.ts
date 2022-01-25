import {MapData, MapGenerator} from '@/config/types';
import {addLocalMaps} from './enhancer';
import {parseGeoJSONFeature} from './parser';

export const generateMapData: MapGenerator = (...inputs) => {
  const mapData = inputs.reduce((acc, input) => {
    const {collection, category} = input;

    collection.features.forEach(feature => {
      const computed = parseGeoJSONFeature(feature, category);
      acc.set(computed.properties.id, computed);
    });

    return acc;
  }, new Map<string, MapData>());

  return addLocalMaps(mapData);
};
