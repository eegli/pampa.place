import {initialize, Map} from '@googlemaps/jest-mocks';
import '@testing-library/jest-dom/extend-expect';

jest.mock('../config/maps');

jest.spyOn(global.console, 'log').mockImplementation(() => jest.fn());

//@ts-expect-error
Map.prototype.data = {
  addGeoJson: jest
    .fn()
    .mockImplementation(() => ['feature 1', 'feature 2', 'feature 3']),
  setStyle: jest.fn(),
  remove: jest.fn(),
};

initialize();

global.google.maps.StreetViewPanorama = jest.fn().mockImplementation(() => {
  return {setPano: jest.fn(), setOptions: jest.fn()};
});
