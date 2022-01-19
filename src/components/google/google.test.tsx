import {config} from '@/config/game';
import {
  MapService,
  MarkerService,
  PolyLineService,
  StreetViewService,
} from '@/services/google';
import {testMap} from '@/tests/fixtures/map';
import {createMockStore, render, screen} from '@/tests/utils';
import {mocked} from 'jest-mock';
import {GoogleMap, GoogleMapProps} from './map';
import {svgMarkerColors} from './marker';
import {GoogleStreetView} from './street-view';
// Mock implementation for listeners. The handler will be caught and
// called with the event it would get from google.maps.Map's click
// event. Unfortunately, this event has no official types

// Store a reference to the events that are called when the map is
// mounted

// eslint-disable-next-line @typescript-eslint/ban-types
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

const services = {
  gmap: mocked(MapService, true),
  gsv: mocked(StreetViewService, true),
  gmarkers: mocked(MarkerService, true),
  gpolylines: mocked(PolyLineService, true),
};

describe('Google, Map', () => {
  it('renders and has containers in document', () => {
    const mapMountSpy = jest.spyOn(MapService, 'mount');
    const {unmount} = render(<GoogleMap map={testMap} />);
    expect(screen.getByTestId('__GMAP__CONTAINER__')).toBeInTheDocument();
    expect(screen.getByTestId('__GMAP__')).toBeInTheDocument();
    expect(screen.getByTestId('__GMAP__')).toHaveStyle('height:100%');
    expect(mapMountSpy).toHaveBeenCalledTimes(1);
    expect(services.gmap.map.setOptions).not.toHaveBeenCalled();
    expect(events).toHaveLength(1);
    expect(events[0].event).toBe('idle');
    events[0].func();
    expect(services.gmap.map.fitBounds).toHaveBeenCalledTimes(1);
    unmount();
  });
  it('has preview mode', () => {
    const {unmount} = render(<GoogleMap map={testMap} mode="preview" />);
    expect(services.gmap.map.setOptions.mock.calls[0]).toMatchSnapshot(
      'preview settings'
    );
    expect(services.gmap.map.data.setStyle).toHaveBeenCalledTimes(1);
    expect(services.gmap.map.data.addGeoJson).toHaveBeenCalledTimes(1);
    expect(services.gmap.map.data.setStyle).toHaveBeenCalledTimes(1);
    unmount();
    expect(services.gmap.map.data.remove).toHaveBeenCalledTimes(1);
  });
  it('has play mode', () => {
    const store = createMockStore();
    const {unmount} = render(<GoogleMap map={testMap} mode="play" />, store);
    expect(services.gmap.map.setOptions.mock.calls[0]).toMatchSnapshot(
      'play settings'
    );
    expect(services.gmarkers.items).toHaveLength(1);
    expect(services.gmarkers.items[0].setMap).toHaveBeenCalledTimes(1);
    expect(services.gmarkers.items[0].setDraggable).toHaveBeenCalledTimes(1);
    expect(events.length).toBe(2);
    expect(events[1].event).toBe('click');
    events[1].func();
    expect(services.gmarkers.items[0].setPosition).toHaveBeenCalledTimes(1);
    events[1].func();
    expect(services.gmarkers.items[0].setPosition).toHaveBeenCalledTimes(2);
    expect(store.getState().position.selectedPosition).toMatchSnapshot(
      'update selected position'
    );
    unmount();
    expect(services.gmarkers.items).toHaveLength(0);
  });
  it('has result mode', () => {
    const props: GoogleMapProps = {
      map: testMap,
      mode: 'result',
      results: [
        {name: 'a', selected: {lat: 1, lng: 1}},
        {name: 'b', selected: {lat: 1, lng: 1}},
      ],
      initialPosition: {lat: 1, lng: 1},
    };
    const {unmount} = render(<GoogleMap {...props} />);
    expect(services.gmap.map.setOptions.mock.calls[0]).toMatchSnapshot(
      'result settings'
    );
    expect(services.gmarkers.items).toHaveLength(3);
    expect(services.gpolylines.items).toHaveLength(2);
    unmount();
    expect(services.gmarkers.items).toHaveLength(0);
    expect(services.gpolylines.items).toHaveLength(0);
  });
});

describe('Google, Street view', () => {
  it('renders and has containers in document', () => {
    render(<GoogleStreetView />);
    expect(screen.getByTestId('__GSTV__CONTAINER__')).toBeInTheDocument();
    expect(screen.getByTestId('__GSTV__')).toBeInTheDocument();
    expect(screen.getByTestId('__GSTV__')).toHaveStyle('height:100%');
  });
  it('has game mode', () => {
    render(<GoogleStreetView />);
    expect(services.gsv.sv.setPano).toHaveBeenCalledTimes(1);
    expect(services.gsv.sv.setOptions.mock.calls[0][0]).toMatchSnapshot(
      'options default'
    );
  });
  it('has static review mode', () => {
    render(<GoogleStreetView staticPos />);
    expect(services.gsv.sv.setPano).toHaveBeenCalledTimes(1);
    expect(services.gsv.sv.setOptions.mock.calls[0][0]).toMatchSnapshot(
      'options static'
    );
  });
});

describe('Google, custom marker', () => {
  it('defines a marker color for each player', () => {
    expect(config.maxPlayers).toBeLessThanOrEqual(svgMarkerColors.length);
  });
});
