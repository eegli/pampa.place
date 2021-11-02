import { render } from '@/tests/test-utils';
import { initialize, Map } from '@googlemaps/jest-mocks';
import React from 'react';
import { Gmap } from '../../../services/google-map';
import GoogleMap, { MapMode } from '../google.map';

beforeEach(() => {
  initialize();
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
    const { container } = render(<GoogleMap activeMapId="1mSRVyWP3tLQ" />);

    expect(Gmap.map.fitBounds).toHaveBeenCalledTimes(1);
    expect(container.querySelector('#__GMAP__CONTAINER__')).toBeInTheDocument();
    expect(container.querySelector('#__GMAP__')).toHaveStyle('height:100%');
  });
  it('has preview mode', () => {
    const { unmount } = render(
      <GoogleMap activeMapId="1mSRVyWP3tLQ" mode={MapMode.PREVIEW} />
    );

    expect(mockAddGeoJSON).toHaveBeenCalledTimes(1);
    expect(mockSetStyle).toHaveBeenCalledTimes(1);
    unmount();
    expect(mockRemove).toHaveBeenCalledTimes(3);
  });
});
