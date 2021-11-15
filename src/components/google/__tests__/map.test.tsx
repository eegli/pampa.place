import {render} from '@/tests/test-utils';
import {Map} from '@googlemaps/jest-mocks';
import React from 'react';
import {Gmap} from '../../../services/google-map';
import GoogleMap, {MapMode} from '../google.map';

jest.spyOn(React, 'useRef').mockReturnValue({
  current: document.createElement('div'),
});

const addGeoJsonSpy = jest.spyOn(Map.prototype.data, 'addGeoJson');

const setStyleSpy = jest.spyOn(Map.prototype.data, 'setStyle');

const removeGeoJsonSpy = jest.spyOn(Map.prototype.data, 'remove');

describe('Google Map', () => {
  it('renders google map', () => {
    const {container} = render(<GoogleMap activeMapId="1mSRVyWP3tLQ" />);

    expect(Gmap.map.fitBounds).toHaveBeenCalledTimes(1);
    expect(container.querySelector('#__GMAP__CONTAINER__')).toBeInTheDocument();
    expect(container.querySelector('#__GMAP__')).toHaveStyle('height:100%');
  });
  it('has preview mode', () => {
    const {unmount} = render(
      <GoogleMap activeMapId="1mSRVyWP3tLQ" mode={MapMode.PREVIEW} />
    );

    expect(addGeoJsonSpy).toHaveBeenCalledTimes(1);
    expect(setStyleSpy).toHaveBeenCalledTimes(1);
    unmount();
    expect(removeGeoJsonSpy).toHaveBeenCalledTimes(3);
  });
});
