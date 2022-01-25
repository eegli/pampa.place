import {Constants} from '@/config/constants';
import {LocalStorageMaps, MapData} from '@/config/types';
import {
  testMap,
  userInputFeature,
  userInputFeatureCollection,
} from '@/tests/fixtures/map';
import {Feature, GeometryTypes, MultiPolygon} from '@turf/helpers';
import {DeepPartial} from '../../utils/types';
import {generateMapData} from '../helpers/generator';
import {parseGeoJSONFeature, parseUserGeoJSON} from '../helpers/parser';

const mockData = (type: GeometryTypes): Feature => {
  const clone: Feature = JSON.parse(JSON.stringify(testMap));
  clone.geometry.type = type;
  return clone;
};

describe('Map utilities and parsing', () => {
  it('parses polygons and multipolygons', () => {
    expect(() => parseGeoJSONFeature(testMap, 'test')).not.toThrow();
    expect(() =>
      parseGeoJSONFeature(
        mockData('MultiPolygon') as Feature<MultiPolygon>,
        'test'
      )
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
      expect(() => parseGeoJSONFeature(mockData(type), 'test')).toThrow();
    });
  });

  it('parses user input, features and feature collections', () => {
    expect(
      parseUserGeoJSON(
        JSON.stringify(userInputFeatureCollection),
        'my map',
        'my category'
      )
    ).toMatchObject<DeepPartial<MapData>>({
      properties: {name: 'my map', category: 'my category'},
    });
    expect(
      parseUserGeoJSON(
        JSON.stringify(userInputFeature),
        'my map',
        'my category'
      )
    ).toMatchObject<DeepPartial<MapData>>({
      properties: {name: 'my map', category: 'my category'},
    });
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
