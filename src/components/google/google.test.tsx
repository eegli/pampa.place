import {render, screen} from '@/tests/utils';
import {Map, mockInstances, StreetViewPanorama} from '@googlemaps/jest-mocks';
import {GoogleMap} from './google-map';
import {GoogleStreetView} from './google-street-view';

// Since the app creates only a single map/sv instance, we also only
// get a single mock class. This needs to be a function as the mocked
// instance is only available after render.
const getMockMapInstance = () => mockInstances.get(Map)[0];
const getMockStreetViewInstance = () =>
  mockInstances.get(StreetViewPanorama)[0];

// eslint-disable-next-line @typescript-eslint/ban-types
const events: {event: string; func: Function}[] = [];
const removeEventListener = jest.fn();

const listenerSpy = jest
  .spyOn(google.maps.event, 'addListenerOnce')
  .mockImplementation((_, event, handler) => {
    events.push({event, func: handler});
    return {remove: removeEventListener};
  });

afterEach(() => {
  jest.clearAllMocks();
  events.length = 0;
});

describe('Google, Map', () => {
  it('has containers in document', () => {
    render(<GoogleMap center={{lat: 0, lng: 0}} />);
    expect(screen.getByTestId('__GMAP__CONTAINER__')).toBeInTheDocument();
    expect(screen.getByTestId('__GMAP__')).toBeInTheDocument();
    expect(screen.getByTestId('__GMAP__')).toHaveStyle('height:100%');
  });
  it('renders with center props', () => {
    render(<GoogleMap center={{lat: 0, lng: 0}} />);
    const map = getMockMapInstance();
    expect(map.setOptions).not.toHaveBeenCalled();
    expect(listenerSpy).not.toHaveBeenCalled();

    expect(map.setCenter).toHaveBeenCalledTimes(1);
    expect(map.setZoom).toHaveBeenCalledTimes(1);
  });
  it('renders with bounds props', () => {
    render(
      <GoogleMap
        id="gmap"
        bounds={{NE: {lat: 1, lng: 1}, SW: {lat: 2, lng: 2}}}
      />
    );
    const map = getMockMapInstance();
    expect(map.setOptions).not.toHaveBeenCalled();
    expect(listenerSpy).toHaveBeenCalledTimes(1);
    expect(events).toHaveLength(1);
    events[0].func();
    expect(map.fitBounds).toHaveBeenCalledTimes(1);
    expect(map.setCenter).not.toHaveBeenCalled();
    expect(map.setZoom).not.toHaveBeenCalled();
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
    const stv = getMockStreetViewInstance();
    expect(stv.setPano).toHaveBeenCalledTimes(1);
    expect(stv.setOptions.mock.calls[0][0]).toMatchSnapshot('options default');
  });
  it('has static review mode', () => {
    render(<GoogleStreetView staticPos />);
    const stv = getMockStreetViewInstance();
    expect(stv.setPano).toHaveBeenCalledTimes(1);
    expect(stv.setOptions.mock.calls[0][0]).toMatchSnapshot('options static');
  });
});
