import {testMapId} from '@/config/__mocks__/maps';
import {render, screen} from '@/tests/test-utils';
import {Map} from '@googlemaps/jest-mocks';
import React from 'react';
import {Gmap} from '../../../services/google-map';
import GoogleMap, {MapMode} from '../google.map';

jest.spyOn(React, 'useRef').mockReturnValue({
  current: document.createElement('div'),
});

describe('Google Map', () => {
  it('renders google map', () => {
    render(<GoogleMap mapId={testMapId} />);
    expect(screen.getByTestId('__GMAP__CONTAINER__')).toBeInTheDocument();
    expect(screen.getByTestId('__GMAP__')).toHaveStyle('height:100%');
  });
  it('has preview mode', () => {
    const addGeoJsonSpy = jest.spyOn(Map.prototype.data, 'addGeoJson');
    const setStyleSpy = jest.spyOn(Map.prototype.data, 'setStyle');
    const removeGeoJsonSpy = jest.spyOn(Map.prototype.data, 'remove');
    const setOptonsSpy = jest.spyOn(Gmap.map, 'setOptions');

    const {unmount} = render(
      <GoogleMap mapId={testMapId} mode={MapMode.PREVIEW} />
    );
    expect(setOptonsSpy.mock.calls[0]).toMatchSnapshot('preview settings');
    expect(addGeoJsonSpy).toHaveBeenCalledTimes(1);
    expect(setStyleSpy).toHaveBeenCalledTimes(1);
    unmount();
    expect(removeGeoJsonSpy).toHaveBeenCalledTimes(3);
  });

  it('has play mode', () => {
    const {unmount} = render(
      <GoogleMap mapId={testMapId} mode={MapMode.PLAY} />
    );
  });
});
