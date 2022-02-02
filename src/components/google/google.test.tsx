import {MapService, StreetViewService} from '@/services/google';
import {render, screen} from '@/tests/utils';
import {mocked} from 'jest-mock';
import {GoogleMap} from './google-map';
import {GoogleStreetView} from './google-street-view';

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

const services = {
  gmap: mocked(MapService, true),
  gsv: mocked(StreetViewService, true),
};

describe('Google, Map', () => {
  it('has containers in document', () => {
    const mapMountSpy = jest.spyOn(MapService, 'mount');
    render(<GoogleMap id="gmap" center={{lat: 0, lng: 0}} />);
    expect(screen.getByTestId('__GMAP__CONTAINER__')).toBeInTheDocument();
    expect(screen.getByTestId('__GMAP__')).toBeInTheDocument();
    expect(screen.getByTestId('__GMAP__')).toHaveStyle('height:100%');
    expect(mapMountSpy).toHaveBeenCalledTimes(1);
  });
  it('renders with center props', () => {
    render(<GoogleMap id="gmap" center={{lat: 0, lng: 0}} />);
    expect(services.gmap.map.setOptions).not.toHaveBeenCalled();
    expect(listenerSpy).not.toHaveBeenCalled();

    expect(services.gmap.map.setCenter).toHaveBeenCalledTimes(1);
    expect(services.gmap.map.setZoom).toHaveBeenCalledTimes(1);
  });
  it('renders with bounds props', () => {
    render(
      <GoogleMap
        id="gmap"
        bounds={{NE: {lat: 1, lng: 1}, SW: {lat: 2, lng: 2}}}
      />
    );
    expect(services.gmap.map.setOptions).not.toHaveBeenCalled();
    expect(listenerSpy).toHaveBeenCalledTimes(1);
    expect(events).toHaveLength(1);
    events[0].func();
    expect(services.gmap.map.fitBounds).toHaveBeenCalledTimes(1);
    expect(services.gmap.map.setCenter).not.toHaveBeenCalled();
    expect(services.gmap.map.setZoom).not.toHaveBeenCalled();
  });
});

describe('Google, Street view', () => {
  it('renders and has containers in document', () => {
    render(<GoogleStreetView id="" />);
    expect(screen.getByTestId('__GSTV__CONTAINER__')).toBeInTheDocument();
    expect(screen.getByTestId('__GSTV__')).toBeInTheDocument();
    expect(screen.getByTestId('__GSTV__')).toHaveStyle('height:100%');
  });
  it('has game mode', () => {
    render(<GoogleStreetView id="" />);
    expect(services.gsv.sv.setPano).toHaveBeenCalledTimes(1);
    expect(services.gsv.sv.setOptions.mock.calls[0][0]).toMatchSnapshot(
      'options default'
    );
  });
  it('has static review mode', () => {
    render(<GoogleStreetView id="" staticPos />);
    expect(services.gsv.sv.setPano).toHaveBeenCalledTimes(1);
    expect(services.gsv.sv.setOptions.mock.calls[0][0]).toMatchSnapshot(
      'options static'
    );
  });
});
