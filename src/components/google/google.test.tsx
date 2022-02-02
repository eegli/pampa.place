import {
  MapService,
  MarkerService,
  PolyLineService,
  StreetViewService,
} from '@/services/google';
import {render, screen} from '@/tests/utils';
import {mocked} from 'jest-mock';
import {GoogleMap} from './google-map';
import {GoogleStreetView} from './google-street-view';
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
    const {unmount} = render(<GoogleMap id="gmap" center={{lat: 0, lng: 0}} />);
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
