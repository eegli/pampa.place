import {initialize} from '@googlemaps/jest-mocks';
import '@testing-library/jest-dom/extend-expect';
import {NextRouter} from 'next/router';
import {GoogleStreetViewResponse} from './payloads/google';

/* ----------- VARIA ----------- */
jest.spyOn(global.console, 'log').mockImplementation(() => jest.fn());
jest.spyOn(global.console, 'info').mockImplementation(() => jest.fn());
jest.spyOn(global.console, 'warn').mockImplementation(() => jest.fn());

/* ----------- INTERNALS ----------- */
jest.mock('@/maps/index');
jest.mock('@/config/game');

/* ----------- NODE MODULES ----------- */
// Default implementation. For specific tests, create a dedicated mock
jest.mock('next/router', () => {
  const mockRouter: NextRouter = {
    replace: jest.fn().mockResolvedValue(true),
    push: jest.fn().mockResolvedValue(true),
    prefetch: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    beforePopState: jest.fn(),
    basePath: '',
    isLocaleDomain: false,
    isFallback: false,
    isPreview: false,
    isReady: true,
    route: '/',
    pathname: '/',
    query: {},
    asPath: '',
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
  };

  return {
    useRouter() {
      return mockRouter;
    },
  };
});

/* ----------- GOOGLE MAPS ----------- */
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
    return Promise.resolve(GoogleStreetViewResponse);
  }
};

/* 

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
    length: (() => Object.keys(store).length)(),
  };
})();

Object.defineProperty(window, 'sessionStorage', {value: sessionStorageMock});

*/
