import {
  createMockState,
  createMockStore,
  fireEvent,
  render,
  screen,
} from '@/tests/test-utils';
import {RoundOverSummary} from '../states/round-over';

const mockPush = jest.fn();

jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: mockPush,
    };
  },
}));

describe('Round over summary', () => {
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
    expect(store.getState().game.status).toBe('PENDING_PLAYER');
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
    expect(store.getState().game.status).toBe('FINISHED');
  });
});