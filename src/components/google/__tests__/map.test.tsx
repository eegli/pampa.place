import {testMapId} from '@/config/__mocks__/maps';
import {createMockStore, render, screen} from '@/tests/test-utils';
import React from 'react';
import {mocked} from 'ts-jest/utils';
import {Gmap} from '../../../services/google-map';
import GoogleMap, {GoogleMapProps} from '../google.map';

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

// Mock implementation for listeners. The handler will be caught and
// called with the event it would get from google.maps.Map's click
// event. Unfortunately, this event has no official types
jest.spyOn(mockGmap.map, 'addListener').mockImplementation((event, handler) => {
  const clickEvent = {latLng: {lat: () => 8, lng: () => 8}};
  const func = () => handler(clickEvent);
  events.push({event, func});
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
    const {unmount} = render(<GoogleMap mapId={testMapId} mode="preview" />);
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
    const store = createMockStore();
    const {unmount} = render(
      <GoogleMap mapId={testMapId} mode="play" />,
      store
    );
    expect(mockGmap.map.setOptions.mock.calls[0]).toMatchSnapshot(
      'play settings'
    );
    expect(mockGmap.markers.length).toBe(1);
    expect(events.length).toBe(2);
    expect(events[1].event).toBe('click');
    events[1].func();
    expect(mockGmap.markers[0].setPosition).toHaveBeenCalledTimes(1);
    expect(store.getState().position.selectedPosition).toMatchSnapshot(
      'update selected position'
    );
    unmount();
    expect(removeEventListener).toHaveBeenCalledTimes(1);
    expect(mockGmap.markers.length).toBe(0);
  });
  it('has result mode', () => {
    const props: GoogleMapProps = {
      mapId: testMapId,
      mode: 'result',
      results: [
        {name: 'a', selected: {lat: 1, lng: 1}},
        {name: 'b', selected: {lat: 1, lng: 1}},
      ],
    };
    const {unmount} = render(<GoogleMap {...props} />);
    expect(mockGmap.map.setOptions.mock.calls[0]).toMatchSnapshot(
      'result settings'
    );
    expect(mockGmap.markers.length).toBe(3);
    unmount();
    expect(mockGmap.markers.length).toBe(0);
  });
});
