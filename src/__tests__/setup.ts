import {initialize, LatLng, Size} from '@googlemaps/jest-mocks';
import '@testing-library/jest-dom/extend-expect';

jest.mock('../config/maps');

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
  async getPanorama() {
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
