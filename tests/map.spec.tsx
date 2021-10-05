import { initialize, Map } from '@googlemaps/jest-mocks';
import React from 'react';
import GoogleMap, { MapMode } from '../src/components/google/google.map';
import { testMap } from './payloads/map-data';
import { render } from './test-utils';

beforeEach(() => {
  initialize();
});

const mockMap = Map as jest.MockedClass<typeof Map>;

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
    const { container } = render(
      <GoogleMap mapData={testMap} mode={MapMode.PREVIEW} />
    );
    expect(mockMap.mock).toMatchInlineSnapshot(`undefined`);
    expect(container.firstChild).toMatchSnapshot();
  });
});
