import customMaps from '../../custom-maps';
import { defaultSettings } from './defaults';
import { markers } from './markers';
import type { MapData } from './types';
export * from './types';

const maps = customMaps.reduce((acc, curr) => {
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
}, [] as MapData[]);

export default {
  defaults: defaultSettings,
  markers,
  maps,
};
