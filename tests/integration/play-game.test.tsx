import {initGame, setRounds, STATUS} from '@/redux/game';
import {MapService} from '@/services/google';
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
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
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
      screen.getByRole('button', {name: /getting a random street view/i})
    ).toBeDisabled();

    await waitFor(() => expect(getPanoramSpy).toHaveBeenCalledTimes(50));
    const alertDialog = screen.getByRole('alert');
    expect(
      within(alertDialog).getByText(/no results found/i)
    ).toBeInTheDocument();
    expect(
      within(alertDialog).getByText(/error getting street view data/i)
    ).toBeInTheDocument();

    // Try again and find a panorama
    getPanoramSpy.mockResolvedValue(GoogleStreetViewResponse);

    fireEvent.click(screen.getByRole('button', {name: /search again/i}));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    // Router returns a promise
    await waitFor(() => {
      expect(
        screen.getByRole('button', {name: /Start round/i})
      ).not.toBeDisabled();
    });

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
    const startBtn = await screen.findByRole('button', {name: /start round/i});
    fireEvent.click(startBtn);
    expect(screen.getByTestId('google-map-play-mode')).toBeInTheDocument();
    expect(screen.getByTestId('google-sv-play-mode')).toBeInTheDocument();
    const miniMap = screen.getByRole('region');
    expect(miniMap).toHaveStyle({height: '150px', width: '200px'});
    const openMiniMapIcon = screen.getByRole('button', {
      name: /mini-map open button/i,
    });
    fireEvent.click(openMiniMapIcon);
    expect(miniMap).toHaveStyle({height: '700px', width: '700px'});
    const closeMiniMapIcon = screen.getByRole('button', {
      name: /mini-map close button/i,
    });
    fireEvent.click(closeMiniMapIcon);
    expect(miniMap).toHaveStyle({height: '150px', width: '200px'});
    fireEvent.click(openMiniMapIcon);
    const submitBtn = screen.getByRole('button', {
      name: /location submit button/i,
    });
    expect(submitBtn).toHaveTextContent(/place the marker/i);
    // Fake putting a marker on the map
    act(() => mockClickEvent.click());
    await waitFor(() => {
      expect(submitBtn).toHaveTextContent(/i'm here/i);
    });
    fireEvent.click(submitBtn);
  });

  it('displays round 1 summary', () => {
    expect(store.getState().game.status).toBe(STATUS.ROUND_ENDED);

    const {unmount} = render(<GamePage />, store);
    expect(screen.getByRole('heading')).toHaveTextContent(/Round 1 is over!/i);
    expect(screen.getByRole('table')).toMatchSnapshot('summary screen');
    expect(screen.getByRole('tablist')).toHaveTextContent(
      /(Result|Map|Street View|Info)/i
    );
    expect(screen.getByRole('tab', {selected: true})).toHaveTextContent(
      /Result/i
    );

    fireEvent.click(screen.getByRole('tab', {name: /Map/i}));
    expect(screen.getByTestId('google-map-review-mode')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', {name: /Street View/i}));
    expect(screen.getByTestId('google-sv-review-mode')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', {name: /Info/i}));

    const infoItems = screen.getAllByRole('listitem');
    expect(infoItems).toMatchSnapshot('info table');
    expect(infoItems).toHaveLength(2);

    fireEvent.click(screen.getByRole('tab', {name: /Result/i}));
    const continueBtn = screen.getByRole('button', {
      name: /Continue with round 2/i,
    });
    fireEvent.click(continueBtn);
    // Here, unmount needs to be called explicitly because of race conditions when unmounting
    // https://github.com/testing-library/react-testing-library/issues/999
    unmount();
  });

  it('dispatches score in round 2 after time runs out', async () => {
    expect(store.getState().game.status).toBe(STATUS.PENDING_PLAYER);

    render(<GamePage />, store);
    const startBtn = await screen.findByRole('button', {name: /start round/i});
    fireEvent.click(startBtn);

    act(() => {
      jest.runAllTimers();
    });

    await waitFor(
      () => {
        screen.getByRole('table');
      },
      // Fake awaiting the game timer (30s)
      {timeout: 1000 * 31}
    );

    expect(screen.getByRole('table')).toMatchSnapshot('summary');

    const resultButton = screen.getByRole('button', {name: /See results!/i});
    expect(resultButton).toBeInTheDocument();
    fireEvent.click(resultButton);
  });

  it('displays final game summary', () => {
    expect(store.getState().game.status).toBe(STATUS.FINISHED);

    render(<GamePage />, store);
    expect(screen.getByRole('table')).toMatchSnapshot('summary');
    const headings = screen.getAllByRole('heading');
    expect(headings[0]).toHaveTextContent(/Game over!/i);
    expect(headings[1]).toHaveTextContent(/Player 1 wins/i);
    const restartButton = screen.getByRole('button', {name: /Play again/i});
    expect(restartButton).toBeInTheDocument();
    fireEvent.click(restartButton);
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
