import { initialize, Map } from '@googlemaps/jest-mocks';
import React from 'react';
import GoogleMap, { MapMode } from '../src/components/google/google.map';
import { testMap } from './payloads/map-data';
import { render } from './test-utils';

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

// @ts-expect-error
Map.prototype.data = {
  addGeoJson: jest.fn().mockImplementation(() => []),
  setStyle: jest.fn(),
};

describe('Google Map', () => {
  it('renders', () => {
    const { container } = render(
      <GoogleMap mapData={testMap} mode={MapMode.PREVIEW} />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
