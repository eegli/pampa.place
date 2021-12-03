import {
  createMockState,
  createMockStore,
  fireEvent,
  render,
  screen,
} from '@/tests/utils';
import {GameOverSummary} from '../states/game-over';

const mockPush = jest.fn();

jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: mockPush,
    };
  },
}));

describe('Game over summary', () => {
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
