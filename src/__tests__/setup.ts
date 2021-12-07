import {initialize, LatLng, MVCObject, Size} from '@googlemaps/jest-mocks';
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

// @ts-expect-error - mock just what we need
global.google.maps.event = {
  addListenerOnce: jest.fn().mockReturnValue(MapsEventListener),
};

export class StreetViewService implements google.maps.StreetViewService {
  constructor() {}
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
}
global.google.maps.StreetViewService = StreetViewService;
global.google.maps.StreetViewPreference = {
  // @ts-expect-error
  BEST: 'best',
  // @ts-expect-error
  NEAREST: 'nearest',
};
global.google.maps.StreetViewSource = {
  // @ts-expect-error
  OUTDOOR: 'outdoor',
  // @ts-expect-error
  DEFAULT: 'default',
};

// TODO
global.google.maps.StreetViewPanorama = class MockStreetViewPanorama
  extends MVCObject
  implements google.maps.StreetViewPanorama
{
  constructor() {
    super();
  }
  controls = [];
  getLinks = jest.fn();
  registerPanoProvider = jest.fn();
  setLinks = jest.fn();
  getLocation = jest.fn();
  getMotionTracking = jest.fn();
  getPano = jest.fn();
  getPhotographerPov = jest.fn();
  getPosition = jest.fn();
  getPov = jest.fn();
  getStatus = jest.fn();
  getVisible = jest.fn();
  getZoom = jest.fn();
  setVisible = jest.fn();
  setPov = jest.fn();
  setPosition = jest.fn();
  setZoom = jest.fn();
  setLinksControl = jest.fn();
  setPanControl = jest.fn();
  setZoomControl = jest.fn();
  setMotionTracking = jest.fn();
  setMotionTrackingControl = jest.fn();
  setOptions = jest.fn();
  setPano = jest.fn();
  setPanControlOptions = jest.fn();
  setMotionTrackingOptions = jest.fn();
  setMotionTrackingControlOptions = jest.fn();
  setZoomControlOptions = jest.fn();
};
