import {Constants} from '../constants';
import {generateMapData} from '../helpers/generator';
import {validateAndComputeGeoJSON} from '../helpers/validator';
import {LocalStorageMaps, MapData} from '../types';
import {testMap, userInputFeatureCollection} from '../__fixtures__/';

describe('Config generation helpers', () => {
  it('works with features', () => {
    expect(() => validateAndComputeGeoJSON(testMap, 'test')).not.toThrow();
  });
  it('rejects featurecollections', () => {
    expect(() =>
      // @ts-expect-error test input
      validateAndComputeGeoJSON(userInputFeatureCollection, 'test')
    ).toThrow();
  });
  it('loads maps from localstorage', () => {
    const mapCopy: MapData = JSON.parse(JSON.stringify(testMap));
    mapCopy.properties.name = 'local map';
    const localMaps: LocalStorageMaps = {
      anyKey: mapCopy,
    };
    window.localStorage.setItem(
      Constants.LOCALSTORAGE_MAPS_KEY,
      JSON.stringify(localMaps)
    );
    const data = generateMapData();
    expect(data.size).toBe(1);
  });
});
