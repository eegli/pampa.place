import { testMap } from '@/tests/payloads/map-data';
import { render } from '@/tests/test-utils';
import { initialize, Map } from '@googlemaps/jest-mocks';
import React from 'react';
import GoogleMap, { MapMode } from '../google.map';

beforeEach(() => {
  initialize();
});

jest.spyOn(React, 'useRef').mockReturnValue({
  current: {
    style: {
      display: '',
    },
  },
});

const consoleSpy = jest
  .spyOn(global.console, 'error')
  .mockImplementation(() => {});

afterAll(() => {
  consoleSpy.mockRestore();
});

// @ts-expect-error
Map.prototype.data = {
  addGeoJson: jest.fn(),
  setStyle: jest.fn(),
};

describe('Google Map', () => {
  it('renders', () => {
    const { container } = render(
      <GoogleMap mapData={testMap} mode={MapMode.PREVIEW} />
    );

    expect(container).toMatchSnapshot();
  });
});
