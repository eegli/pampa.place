import {testMap, userInputFeatureCollection} from '@/tests/fixtures/map';
import {Feature, GeometryTypes} from '@turf/helpers';
import {Constants} from '../constants';
import {generateMapData} from '../helpers/generator';
import {validateAndComputeGeoJSON} from '../helpers/validator';
import {LocalStorageMaps, MapData} from '../types';

const mockData = (type: GeometryTypes): Feature => {
  const clone: Feature = JSON.parse(JSON.stringify(testMap));
  clone.geometry.type = type;
  return clone;
};

describe('Config generation helpers', () => {
  it('works with polygons', () => {
    expect(() => validateAndComputeGeoJSON(testMap, 'test')).not.toThrow();
  });
  it('works with multipolygons', () => {
    expect(() =>
      // @ts-expect-error test input
      validateAndComputeGeoJSON(mockData('MultiPolygon'), 'test')
    ).not.toThrow();
  });
  [
    'Point',
    'LineString',
    'MultiPoint',
    'MultiLineString',
    'GeometryCollection',
  ].forEach(type => {
    it(`throws with geometry type ${type}`, () => {
      // @ts-expect-error test input
      expect(() => validateAndComputeGeoJSON(mockData(type), 'test')).toThrow();
    });
  });
  it('throws with feature collections', () => {
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
