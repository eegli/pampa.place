import {initialize, LatLng, Size} from '@googlemaps/jest-mocks';
import '@testing-library/jest-dom/extend-expect';
import {NextRouter} from 'next/router';

jest.mock('../config/maps');

jest.mock('next/router', () => ({
  useRouter() {
    const router: NextRouter = {
      replace: jest.fn(),
      push: jest.fn(),
      prefetch: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      beforePopState: jest.fn(),
      route: '/',
      pathname: '',
      query: {},
      asPath: '',

      // @ts-expect-error mock router
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
    };
    return router;
  },
}));

const sessionStorageMock: typeof window.sessionStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(store, key)
        ? store[key]
        : null;
    },
    clear() {
      store = {};
    },
    setItem(key, value) {
      store[key] = value;
    },
    removeItem(key) {
      delete store[key];
    },
    key: jest.fn(),
    length: 0,
  };
})();

Object.defineProperty(window, 'sessionStorage', {value: sessionStorageMock});

jest.spyOn(global.console, 'log').mockImplementation(() => jest.fn());
jest.spyOn(global.console, 'info').mockImplementation(() => jest.fn());
jest.spyOn(global.console, 'warn').mockImplementation(() => jest.fn());

initialize();

const MapsEventListener: google.maps.MapsEventListener = {
  remove: jest.fn(),
};

// Enhance the default mock with an actual method
global.google.maps.MVCObject.prototype.addListener = jest
  .fn()
  .mockReturnValue(MapsEventListener);

global.google.maps.event = {
  addListenerOnce: jest.fn().mockReturnValue(MapsEventListener),
  addListener: jest.fn().mockReturnValue(MapsEventListener),
  addDomListenerOnce: jest.fn().mockReturnValue(MapsEventListener),
  addDomListener: jest.fn().mockReturnValue(MapsEventListener),
  hasListeners: jest.fn(),
  clearInstanceListeners: jest.fn(),
  clearListeners: jest.fn(),
  removeListener: jest.fn(),
  trigger: jest.fn(),
};

global.google.maps.StreetViewService = class StreetViewService
  implements google.maps.StreetViewService
{
  getPanorama() {
    const res: google.maps.StreetViewResponse = {
      data: {
        copyright: 'Copyright',
        imageDate: 'August 2020',
        links: [],
        location: {
          description: 'Fake panorama description',
          pano: '69',
          shortDescription: null,
          latLng: new LatLng(1, 2),
        },
        tiles: {
          centerHeading: 0,
          getTileUrl: () => '',
          tileSize: new Size(1, 1),
          worldSize: new Size(1, 1),
        },
      },
    };
    return Promise.resolve(res);
  }
};
