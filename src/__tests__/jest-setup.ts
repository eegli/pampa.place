import {initialize, Map} from '@googlemaps/jest-mocks';
import '@testing-library/jest-dom/extend-expect';

jest.spyOn(global.console, 'log').mockImplementation(() => jest.fn());

jest.mock('../config/maps');

//@ts-expect-error
Map.prototype.data = {
  addGeoJson: jest
    .fn()
    .mockImplementation(() => ['feature 1', 'feature 2', 'feature 3']),
  setStyle: jest.fn(),
  remove: jest.fn(),
};

initialize();
