import {testMapId} from '@/config/__mocks__/maps';
import {render, screen} from '@/tests/test-utils';
import React from 'react';
import {mocked} from 'ts-jest/utils';
import {Gmap} from '../../../services/google-map';
import GoogleMap, {MapMode} from '../google.map';

jest.spyOn(React, 'useRef').mockReturnValue({
  current: document.createElement('div'),
});

const mockGmap = mocked(Gmap, true);
const mockGoogle = mocked(google.maps, true);

afterEach(() => {
  jest.clearAllMocks();
});

describe('Google Map', () => {
  it('renders google map', () => {
    render(<GoogleMap mapId={testMapId} />);
    expect(screen.getByTestId('__GMAP__CONTAINER__')).toBeInTheDocument();
    expect(screen.getByTestId('__GMAP__')).toHaveStyle('height:100%');
  });
  it('has preview mode', () => {
    const {unmount} = render(
      <GoogleMap mapId={testMapId} mode={MapMode.PREVIEW} />
    );
    expect(mockGmap.map.setOptions.mock.calls[0]).toMatchSnapshot(
      'preview settings'
    );
    expect(mockGoogle.Map.prototype.data.setStyle).toHaveBeenCalledTimes(1);
    expect(mockGoogle.Map.prototype.data.addGeoJson).toHaveBeenCalledTimes(1);
    expect(mockGoogle.Map.prototype.data.setStyle).toHaveBeenCalledTimes(1);
    unmount();
    expect(mockGoogle.Map.prototype.data.remove).toHaveBeenCalledTimes(3);
  });

  it('has play mode', () => {
    const {unmount} = render(
      <GoogleMap mapId={testMapId} mode={MapMode.PLAY} />
    );

    expect(google.maps.event.addListenerOnce).toHaveBeenCalledTimes(1);
    expect(mockGmap.map.setOptions.mock.calls[0]).toMatchSnapshot(
      'play settings'
    );
  });
});
