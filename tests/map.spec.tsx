import { initialize, Map } from '@googlemaps/jest-mocks';
import React from 'react';
import GoogleMap, {
  GLOBAL_MAP,
  MapMode,
} from '../src/components/google/google.map';
import { testMap } from './payloads/map-data';
import { render } from './test-utils';

beforeEach(() => {
  initialize();
});

jest.spyOn(React, 'useRef').mockReturnValue({
  current: document.createElement('div'),
});

// @ts-expect-error
Map.prototype.data = {
  addGeoJson: jest.fn().mockImplementation(() => []),
  setStyle: jest.fn(),
};

describe('Google Map', () => {
  it('renders', () => {
    expect(GLOBAL_MAP).toBeUndefined();
    const { container } = render(
      <GoogleMap mapData={testMap} mode={MapMode.PREVIEW} />
    );
    expect(GLOBAL_MAP).not.toBeUndefined();
    expect(GLOBAL_MAP.fitBounds).toHaveBeenCalledTimes(1);
    expect(container.firstChild).toMatchSnapshot();
  });
});
