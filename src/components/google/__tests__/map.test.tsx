import {testMapId} from '@/config/__mocks__/maps';
import {render, screen} from '@/tests/test-utils';
import React from 'react';
import {mocked} from 'ts-jest/utils';
import {Gmap} from '../../../services/google-map';
import GoogleMap, {MapMode} from '../google.map';

const mockGmap = mocked(Gmap, true);
const mockGoogle = mocked(google.maps, true);

// Store a reference to the events that are called when the map is mounted
const events: {event: string; func: Function}[] = [];
const removeEventListener = jest.fn();

jest
  .spyOn(mockGoogle.event, 'addListenerOnce')
  .mockImplementation((_, event, handler) => {
    events.push({event, func: handler});
    return {remove: removeEventListener};
  });

jest.spyOn(mockGmap.map, 'addListener').mockImplementation((event, handler) => {
  events.push({event, func: handler});
  return {remove: removeEventListener};
});

jest.spyOn(React, 'useRef').mockReturnValue({
  current: document.createElement('div'),
});

afterEach(() => {
  jest.clearAllMocks();
  events.length = 0;
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('Google Map', () => {
  it('renders and has containers in document', () => {
    render(<GoogleMap mapId={testMapId} />);
    expect(screen.getByTestId('__GMAP__CONTAINER__')).toBeInTheDocument();
    expect(screen.getByTestId('__GMAP__')).toHaveStyle('height:100%');
    expect(mockGmap.map.setOptions).not.toHaveBeenCalled();
    expect(events).toHaveLength(1);
    expect(events[0].event).toBe('idle');
    events[0].func();
    expect(mockGmap.map.fitBounds).toHaveBeenCalledTimes(1);
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

    expect(mockGmap.map.setOptions.mock.calls[0]).toMatchSnapshot(
      'play settings'
    );
    expect(mockGmap.markers.length).toBe(1);
    expect(events.length).toBe(2);
    expect(events[1].event).toBe('click');

    unmount();
    expect(removeEventListener).toHaveBeenCalledTimes(1);
    expect(mockGmap.markers.length).toBe(0);
  });
});
