import {initialize} from '@googlemaps/jest-mocks';
import '@testing-library/jest-dom/extend-expect';
import {NextRouter} from 'next/router';
import {GoogleStreetViewResponse} from './payloads/google';

/* ----------- VARIA ----------- */
jest.spyOn(global.console, 'log').mockImplementation(() => jest.fn());
jest.spyOn(global.console, 'info').mockImplementation(() => jest.fn());

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
    forward: jest.fn(),
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

// Overwrite the mock implementation provided by the initialize function so we can play with the response and reject when needed

global.google.maps.StreetViewService = class StreetViewService
  implements google.maps.StreetViewService
{
  getPanorama() {
    return Promise.resolve(GoogleStreetViewResponse);
  }
};
