import {testMapId} from '@/config/__mocks__/maps';
import {MapService, StreetViewService} from '@/services/google';
import {createMockStore, render, screen} from '@/tests/utils';
import {mocked} from 'ts-jest/utils';
import {GoogleMap, GoogleMapProps} from './map';
import {GoogleStreetView} from './street-view';

// Mock implementation for listeners. The handler will be caught and
// called with the event it would get from google.maps.Map's click
// event. Unfortunately, this event has no official types

// Store a reference to the events that are called when the map is
// mounted
const events: {event: string; func: Function}[] = [];
const removeEventListener = jest.fn();

jest
  .spyOn(MapService.map, 'addListener')
  .mockImplementation((event, handler) => {
    const clickEvent = {latLng: {lat: () => 8, lng: () => 8}};
    const func = () => handler(clickEvent);
    events.push({event, func});
    return {remove: removeEventListener};
  });

jest
  .spyOn(google.maps.event, 'addListenerOnce')
  .mockImplementation((_, event, handler) => {
    events.push({event, func: handler});
    return {remove: removeEventListener};
  });

// @ts-expect-error - fake at least one element in the array to check
// the cleanup function for the feature
jest.spyOn(MapService.map.data, 'addGeoJson').mockReturnValue(['Feature 1']);

afterEach(() => {
  jest.clearAllMocks();
  events.length = 0;
});

const mockSv = mocked(StreetViewService, true);
const mockGmap = mocked(MapService, true);

describe('Google, Map', () => {
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
    expect(mockGmap.map.data.setStyle).toHaveBeenCalledTimes(1);
    expect(mockGmap.map.data.addGeoJson).toHaveBeenCalledTimes(1);
    expect(mockGmap.map.data.setStyle).toHaveBeenCalledTimes(1);
    unmount();
    expect(mockGmap.map.data.remove).toHaveBeenCalledTimes(1);
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

describe('Google, Street view', () => {
  it('renders and has containers in document', () => {
    render(<GoogleStreetView />);
    expect(screen.getByTestId('__GSTV__CONTAINER__')).toBeInTheDocument();
    expect(screen.getByTestId('__GSTV__')).toHaveStyle('height:100%');
  });
  it('has game mode', () => {
    render(<GoogleStreetView />);
    expect(mockSv.sv.setPano).toHaveBeenCalledTimes(1);
    expect(mockSv.sv.setOptions.mock.calls[0][0]).toMatchSnapshot(
      'options default'
    );
  });
  it('has static review mode', () => {
    render(<GoogleStreetView staticPos />);
    expect(mockSv.sv.setPano).toHaveBeenCalledTimes(1);
    expect(mockSv.sv.setOptions.mock.calls[0][0]).toMatchSnapshot(
      'options static'
    );
  });
});