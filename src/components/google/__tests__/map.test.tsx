import { testMapIds } from '@/tests/payloads/map-data';
import { render } from '@/tests/test-utils';
import { initialize, Map } from '@googlemaps/jest-mocks';
import React from 'react';
import GoogleMap, { GLOBAL_MAP, MapMode, resetGlobalMap } from '../google.map';

beforeEach(() => {
  initialize();
});

afterEach(() => {
  resetGlobalMap();
});

jest.spyOn(React, 'useRef').mockReturnValue({
  current: document.createElement('div'),
});

// Return at least one element to test the cleanup function
const mockAddGeoJSON = jest
  .fn()
  .mockImplementation(() => ['feature 1', 'feature 2', 'feature 3']);
const mockSetStyle = jest.fn();
const mockRemove = jest.fn();

// @ts-expect-error
Map.prototype.data = {
  addGeoJson: mockAddGeoJSON,
  setStyle: mockSetStyle,
  remove: mockRemove,
};

describe('Google Map', () => {
  it('renders google map', () => {
    expect(GLOBAL_MAP).toBeUndefined();
    const { container } = render(<GoogleMap activeMapId={testMapIds[0].id} />);

    expect(GLOBAL_MAP).not.toBeUndefined();
    expect(GLOBAL_MAP).toBeInstanceOf(Map);
    expect(GLOBAL_MAP!.fitBounds).toHaveBeenCalledTimes(1);
    expect(container.querySelector('#__GMAP__CONTAINER__')).toBeInTheDocument();
    expect(container.querySelector('#__GMAP__')).toHaveStyle('height:100%');
  });
  it('has preview mode', () => {
    const { unmount } = render(
      <GoogleMap activeMapId={testMapIds[0].id} mode={MapMode.PREVIEW} />
    );

    expect(mockAddGeoJSON).toHaveBeenCalledTimes(1);
    expect(mockSetStyle).toHaveBeenCalledTimes(1);
    unmount();
    expect(mockRemove).toHaveBeenCalledTimes(3);
  });
});
