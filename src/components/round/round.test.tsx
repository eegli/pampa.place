import {
  createMockState,
  createMockStore,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@/tests/utils';
import {ValidationError} from '../../redux/position/thunks';
import {GameOverSummary} from './game-over';
import {RoundIntermission} from './intermission';
import {RoundOverSummary} from './round-over';

const mockPush = jest.fn();

jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: mockPush,
    };
  },
}));

const getPanoramSpy = jest.spyOn(
  google.maps.StreetViewService.prototype,
  'getPanorama'
);

afterEach(() => {
  getPanoramSpy.mockReset();
  mockPush.mockReset();
});

describe('Intermission, round ongoing', () => {
  it('requests new street view location, fulfilled', async () => {
    const state = createMockState({
      game: {
        players: ['player 1', 'player 2'],
        rounds: {
          total: 3,
          current: 1,
          // If round progress is 0, get a new location
          progress: 0,
        },
      },
      position: {
        initialPosition: null,
      },
    });
    const store = createMockStore(state);
    render(<RoundIntermission />, store);
    const button = screen.getAllByRole('button')[0];
    await waitFor(() => {
      expect(button).toHaveTextContent(/start/gi);
    });
    fireEvent.click(button);
    expect(store.getState().game.status).toMatchInlineSnapshot(
      `"ROUND_ONGOING"`
    );
    expect(getPanoramSpy).toHaveBeenCalledTimes(1);
    expect(store.getState().position).toMatchSnapshot('sv request, fulfilled');
  });
  it('requests new street view location, rejected', async () => {
    const mockResRejected: ValidationError = {
      code: 'ZERO_RESULTS',
      endpoint: 'google maps',
      message: 'unable to find sv',
      name: 'MapsRequestError',
    };
    getPanoramSpy.mockRejectedValue(mockResRejected);
    const state = createMockState({
      game: {
        players: ['player 1', 'player 2'],
        rounds: {
          total: 3,
          current: 1,
          progress: 0,
        },
      },
      position: {
        initialPosition: null,
      },
    });
    const store = createMockStore(state);
    render(<RoundIntermission />, store);
    await waitFor(() => {
      expect(getPanoramSpy).toHaveBeenCalledTimes(50);
    });
    expect(store.getState().position).toMatchSnapshot('sv request, rejected');
  });
  it('requests new street view location, pending', async () => {
    const state = createMockState({
      game: {
        players: ['player 1', 'player 2'],
        rounds: {
          total: 3,
          current: 1,
          progress: 0,
        },
      },
      position: {
        initialPosition: null,
      },
    });
    const store = createMockStore(state);
    render(<RoundIntermission />, store);
    // Do NOT use waitFor - we want the pending state!
    const button = screen.getAllByRole('button')[0];
    expect(button).toHaveTextContent(/getting/gi);
    expect(button).toHaveAttribute('disabled');
    fireEvent.click(button);
    expect(getPanoramSpy).toHaveBeenCalledTimes(1);
    expect(store.getState().position).toMatchSnapshot('sv request, pending');
  });
});

describe('Summary, round over', () => {
  it('displays end of round scores', () => {
    const state = createMockState({
      game: {
        players: ['player 1', 'player 2'],
        scores: [
          [
            {name: 'player 1', score: 2, selected: null, dist: 12},
            {name: 'player 2', score: 5, selected: null, dist: 69},
          ],
        ],
      },
    });

    const store = createMockStore(state);
    render(<RoundOverSummary />, store);
    const colHeaders = screen.getAllByRole('columnheader');
    const rows = screen.getAllByRole('row');

    // Table haders
    expect(colHeaders).toHaveLength(3);
    expect(colHeaders[0]).toHaveTextContent(/name/i);
    expect(colHeaders[1]).toHaveTextContent(/distance/i);
    expect(colHeaders[2]).toHaveTextContent(/score/i);

    // First row is the header, second row is the winning player
    expect(rows[1]).toHaveTextContent(/player 2/i);
    expect(rows[2]).toHaveTextContent(/player 1/i);
    expect(rows).toHaveLength(3);
    expect(rows[1]).toHaveTextContent(/69/i);
    expect(rows[2]).toHaveTextContent(/12/i);
  });
  it("continues game when it's not done", () => {
    const state = createMockState({
      game: {
        players: ['2', '2'],
        rounds: {
          total: 2,
          current: 1,
          progress: 2,
        },
        scores: [[]],
      },
    });

    const store = createMockStore(state);
    render(<RoundOverSummary />, store);
    const nextRoundButton = screen.getByRole('button', {name: /continue/i});
    expect(nextRoundButton).toBeInTheDocument();
    fireEvent.click(nextRoundButton);
    expect(store.getState().game.rounds.current).toBe(2);
    expect(store.getState().game.rounds.progress).toBe(0);
    expect(store.getState().game.status).toMatchInlineSnapshot(
      `"PENDING_PLAYER"`
    );
  });
  it('finishes game after last round', () => {
    const state = createMockState({
      game: {
        players: ['a', 'b'],
        rounds: {
          total: 2,
          current: 2,
          progress: 2,
        },

        scores: [[], []],
      },
    });
    const store = createMockStore(state);
    render(<RoundOverSummary />, store);
    const endGameButton = screen.getByRole('button', {name: /results/i});
    expect(endGameButton).toBeInTheDocument();
    fireEvent.click(endGameButton);
    expect(store.getState().game.rounds.current).toBe(2);
    expect(store.getState().game.rounds.progress).toBe(2);
    expect(store.getState().game.status).toMatchInlineSnapshot(`"FINISHED"`);
  });
});

describe('Summary, game over', () => {
  it('displays final game scores', () => {
    const state = createMockState({
      game: {
        players: ['player 1', 'player 2'],
        rounds: {
          total: 2,
          current: 2,
          progress: 2,
        },
        scores: [
          [
            {name: 'player 1', score: 1, selected: null, dist: 1},
            {name: 'player 2', score: 1, selected: null, dist: 2},
          ],
          [
            {name: 'player 1', score: 2, selected: null, dist: 3},
            {name: 'player 2', score: 3, selected: null, dist: 2},
          ],
        ],
      },
    });

    const store = createMockStore(state);
    render(<GameOverSummary />, store);
    const colHeaders = screen.getAllByRole('columnheader');
    const rows = screen.getAllByRole('row');

    // Table haders
    expect(colHeaders).toHaveLength(2);
    expect(colHeaders[0]).toHaveTextContent(/name/i);
    expect(colHeaders[1]).toHaveTextContent(/total score/i);

    // First row is the header, second row is the winning player
    // Player 2 has the higher score and thus comes first
    expect(rows[1]).toHaveTextContent(/player 2/i);
    expect(rows[2]).toHaveTextContent(/player 1/i);
    expect(rows).toHaveLength(3);
    expect(rows[1]).toHaveTextContent(/4/i);
    expect(rows[2]).toHaveTextContent(/3/i);

    const button = screen.getByRole('button', {name: /play again/i});
    fireEvent.click(button);
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
