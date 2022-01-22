import {initGame} from '@/redux/game';
import {ValidationError} from '@/redux/position/thunks';
import {MapService} from '@/services/google';
import {GamePage} from 'src/pages/game.page';
import {GoogleStreetViewResponse} from '../../payloads/google';
import {
  createMockState,
  createMockStore,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '../../utils';

const panoError: ValidationError = {
  code: 'ZERO_RESULTS',
  name: 'MapsRequestError',
  endpoint: 'maps',
  message: 'No results found',
};

beforeEach(() => {
  jest.clearAllMocks();
});

const getPanoramSpy = jest.spyOn(
  google.maps.StreetViewService.prototype,
  'getPanorama'
);

describe('Game play integration test', () => {
  const state = createMockState();
  const store = createMockStore(state);
  store.dispatch(initGame());
  test('searches panorama and does not find one first', async () => {
    getPanoramSpy.mockRejectedValue(panoError);
    render(<GamePage />, store);
    expect(
      screen.getByRole('button', {name: /getting a random street view/gi})
    ).toBeDisabled();
    await waitFor(() => expect(getPanoramSpy).toHaveBeenCalledTimes(50));
    const alertDialog = screen.getByRole('alert');
    expect(
      within(alertDialog).getByText(/no results found/gi)
    ).toBeInTheDocument();
    expect(
      within(alertDialog).getByText(/error getting street view data/gi)
    ).toBeInTheDocument();

    // Try again and find a panorama
    getPanoramSpy.mockResolvedValue(GoogleStreetViewResponse);

    fireEvent.click(screen.getByRole('button', {name: /different map/gi}));
    // Router returns a promise
    await waitFor(() =>
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    );
    expect(
      screen.getByRole('button', {name: /start round/gi})
    ).not.toBeDisabled();
    expect(screen.getAllByRole('heading')).toMatchSnapshot(
      'intermission screen'
    );
  });

  test('play mode', async () => {
    const mockClickEvent: Record<string, () => void> = {};
    jest
      .spyOn(MapService.map, 'addListener')
      .mockImplementation((event, handler) => {
        const clickEvent = {latLng: {lat: () => 8, lng: () => 8}};
        const func = () => handler(clickEvent);
        mockClickEvent[event] = func;
        return {remove: () => null};
      });
    render(<GamePage />, store);
    expect(store).toMatchSnapshot();
    fireEvent.click(await screen.findByRole('button', {name: /start round/gi}));
    const map = screen.getByTestId('play-google-map');
    const sv = screen.getByTestId('play-google-street-view');
    const submit = screen.getByRole('button', {name: 'Submit'});
    expect(map).toHaveStyle('height:100%;display:block');
    expect(sv).toHaveStyle('height:100%;display:block');
    expect(submit).toBeDisabled();
    fireEvent.click(screen.getByRole('img', {name: 'map-toggle'}));
    expect(sv).toHaveStyle('height:100%;display:none');
    expect(mockClickEvent).toHaveProperty('click');
    mockClickEvent.click();
    expect(submit).not.toBeDisabled();
    fireEvent.click(submit);
    expect(map).not.toBeInTheDocument();
    expect(sv).not.toBeInTheDocument();
    // console.debug(store.getState());
  });
});
