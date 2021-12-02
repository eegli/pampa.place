import {initialize, MVCObject} from '@googlemaps/jest-mocks';
import '@testing-library/jest-dom/extend-expect';
import {MapService} from '../services/google';

jest.mock('../config/maps');
jest.spyOn(global.console, 'log').mockImplementation(() => jest.fn());

initialize();

jest
  .spyOn(MapService.map, 'addListener')
  .mockImplementation((event, handler) => {
    return {remove: jest.fn()};
  });

jest
  .spyOn(google.maps.event, 'addListenerOnce')
  .mockImplementation((_, event, handler) => {
    return {remove: jest.fn()};
  });

class MockGoogleStreetView
  extends MVCObject
  implements google.maps.StreetViewPanorama
{
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
}

global.google.maps.StreetViewPanorama = MockGoogleStreetView;
