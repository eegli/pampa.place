import {initGame, setRounds} from '@/redux/game';
import {MapService} from '@/services/google';
import {GoogleDOMIds} from '@/services/google/dom';
import {GamePage} from 'src/pages/game.page';
import {
  GoogleStreetViewFailedResponse,
  GoogleStreetViewResponse,
} from '../../payloads/google';
import {
  createMockState,
  createMockStore,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '../../utils';

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
  store.dispatch(setRounds(2));
  store.dispatch(initGame());
  test('searches panorama and does not find one first', async () => {
    getPanoramSpy.mockRejectedValue(GoogleStreetViewFailedResponse);
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

  test('round 1 with user interaction', async () => {
    const mockClickEvent: Record<string, () => void> = {};
    jest
      .spyOn(MapService.map, 'addListener')
      .mockImplementation((event, handler) => {
        const clickEvent = {latLng: {lat: () => 1, lng: () => 1}};
        const func = () => handler(clickEvent);
        mockClickEvent[event] = func;
        return {remove: () => null};
      });
    render(<GamePage />, store);
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
  test('round 1 summary', () => {
    render(<GamePage />, store);
    expect(screen.getByRole('heading')).toHaveTextContent(/Round 1 is over!/i);
    expect(screen.getByRole('table')).toMatchSnapshot('round 1 summary');
    expect(screen.getByRole('tablist')).toHaveTextContent(
      /(Result|Map|Street View|Info)/i
    );
    expect(screen.getByRole('tab', {selected: true})).toHaveTextContent(
      /Result/i
    );
    fireEvent.click(screen.getByRole('tab', {name: /Map/i}));
    expect(screen.getByTestId(GoogleDOMIds.MAP_DIV)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', {name: /Street View/i}));
    expect(screen.getByTestId(GoogleDOMIds.STV_DIV)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', {name: /Info/i}));
    const infoItems = screen.getAllByRole('listitem');
    expect(infoItems).toMatchSnapshot('round 1 info');
    expect(infoItems).toHaveLength(2);
    fireEvent.click(screen.getByRole('tab', {name: /Result/i}));
    fireEvent.click(screen.getByRole('button', {name: /Continue/i}));
  });
  test('round 2 ends after time runs out', () => {
    jest.useFakeTimers('modern');
    render(<GamePage />, store);
    jest.useRealTimers();
  });
});
