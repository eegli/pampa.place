import { mapIds } from '@/config/maps';
import { render } from '@/tests/test-utils';
import { initialize, Map } from '@googlemaps/jest-mocks';
import React from 'react';
import GoogleMap, { GLOBAL_MAP, MapMode } from '../google.map';

beforeEach(() => {
  jest.resetModules();
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
      <GoogleMap activeMapId={mapIds[0]} mode={MapMode.PREVIEW} />
    );
    expect(GLOBAL_MAP).not.toBeUndefined();
    expect(GLOBAL_MAP).toBeInstanceOf(Map);
    expect(GLOBAL_MAP!.fitBounds).toHaveBeenCalledTimes(1);
    expect(container.querySelector('#__GMAP__CONTAINER__')).toBeInTheDocument();
  });
});
