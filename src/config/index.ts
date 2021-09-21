import { defaultSettings, DefaultSettings } from './defaults';
import customMaps from './maps';
import { markerColors } from './markers';

export type MarkerColors = Record<string, string>;

export type MapBounds = Record<
  'latMax' | 'latMin' | 'lngMax' | 'lngMin',
  number
>;
export type MapLatLng = Record<'lat' | 'lng', number>;
export type MapCenter = { center: MapLatLng };
export type MapEdges = Record<'NE' | 'SE' | 'SW' | 'NW', MapLatLng>;

export type UserMapConfig = MapBounds & { __name: string };

export type MapData = UserMapConfig & MapCenter & MapEdges;

interface Config {
  maps: MapData[];
  defaults: DefaultSettings;
  markers: string[];
}

const makeConfig = (): Config => {
  return {
    markers: Object.values(markerColors),
    maps: customMaps.reduce((acc, curr) => {
      acc.push({
        ...curr,
        center: {
          lat: (curr.latMax + curr.latMin) / 2,
          lng: (curr.latMax + curr.latMin) / 2,
        },
        NE: { lat: curr.latMax, lng: curr.lngMax },
        SE: { lat: curr.latMin, lng: curr.lngMax },
        SW: { lat: curr.latMin, lng: curr.lngMin },
        NW: { lat: curr.latMax, lng: curr.lngMin },
      });
      return acc;
    }, [] as MapData[]),
    defaults: defaultSettings,
  };
};

export default makeConfig();
