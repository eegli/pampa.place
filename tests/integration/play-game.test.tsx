import {initGame, setRounds, STATUS} from '@/redux/game';
import {MapService} from '@/services/google';
import {GoogleDOMIds} from '@/services/google/dom';
import {GamePage} from 'src/pages/game.page';
import {
  GoogleStreetViewFailedResponse,
  GoogleStreetViewResponse,
} from '../payloads/google';
import {
  act,
  createMockState,
  createMockStore,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '../utils';

const mockPush = jest.fn().mockResolvedValue(true);

jest.spyOn(require('next/router'), 'useRouter').mockReturnValue({
  push: mockPush,
});

const getPanoramSpy = jest.spyOn(
  google.maps.StreetViewService.prototype,
  'getPanorama'
);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Integration, game play', () => {
  const state = createMockState();
  const store = createMockStore(state);
  store.dispatch(setRounds(2));
  store.dispatch(initGame());

  it('searches panorama and does not find one first', async () => {
    getPanoramSpy.mockRejectedValue(GoogleStreetViewFailedResponse);
    expect(store.getState().game.status).toBe(STATUS.PENDING_PLAYER);

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
      screen.getByRole('button', {name: /Start round/gi})
    ).not.toBeDisabled();
    expect(screen.getAllByRole('heading')).toMatchSnapshot(
      'intermission screen'
    );
    expect(getPanoramSpy).toHaveBeenCalledTimes(51);
  });

  it('round 1 works with user interaction', async () => {
    const mockClickEvent: Record<string, () => void> = {};
    jest
      .spyOn(MapService.map, 'addListener')
      .mockImplementation((event, handler) => {
        const clickEvent = {latLng: {lat: () => 1, lng: () => 1}};
        const func = () => handler(clickEvent);
        mockClickEvent[event] = func;
        return {remove: () => null};
      });
    expect(store.getState().game.status).toBe(STATUS.PENDING_PLAYER);

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
  });

  it('displays round 1 summary', () => {
    expect(store.getState().game.status).toBe(STATUS.ROUND_ENDED);

    render(<GamePage />, store);
    expect(screen.getByRole('heading')).toHaveTextContent(/Round 1 is over!/i);
    expect(screen.getByRole('table')).toMatchSnapshot('summary screen');
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
    expect(infoItems).toMatchSnapshot('info table');
    expect(infoItems).toHaveLength(2);
    fireEvent.click(screen.getByRole('tab', {name: /Result/i}));
    fireEvent.click(
      screen.getByRole('button', {name: /Continue with round 2/i})
    );
  });

  it('dispatches score in round 2 after time runs out', async () => {
    jest.useFakeTimers('modern');
    expect(store.getState().game.status).toBe(STATUS.PENDING_PLAYER);

    render(<GamePage />, store);
    fireEvent.click(await screen.findByRole('button', {name: /start round/gi}));
    const map = screen.getByTestId('play-google-map');
    expect(map).toBeInTheDocument();
    // In tests, the time limit is 30 seconds
    act(() => {
      jest.advanceTimersByTime(31 * 1000);
    });
    expect(map).not.toBeInTheDocument();
    // Skip the round summary - it has already been tested in round 1
    expect(screen.getByRole('table')).toMatchSnapshot('summary');
    const resultButton = screen.getByRole('button', {name: /See results!/i});
    expect(resultButton).toBeInTheDocument();
    fireEvent.click(resultButton);
    jest.useRealTimers();
  });

  it('displays final game summary', () => {
    expect(store.getState().game.status).toBe(STATUS.FINISHED);

    render(<GamePage />, store);
    expect(screen.getByRole('table')).toMatchSnapshot('summary');
    const headings = screen.getAllByRole('heading');
    expect(headings[0]).toHaveTextContent(/Game over!/gi);
    expect(headings[1]).toHaveTextContent(/Player 1 wins/gi);
    const restartButton = screen.getByRole('button', {name: /Play again/i});
    expect(restartButton).toBeInTheDocument();
    fireEvent.click(restartButton);
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
