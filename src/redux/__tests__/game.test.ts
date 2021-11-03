import { DeepPartial } from '@/utils/types';
import gameReducer, {
  gameSlice,
  GameState,
  initialState,
} from '../slices/game';

export const {
  reset,
  initGame,
  startRound,
  endRound,
  resetRound,
  setPlayerScore,
  setRounds,
  setMap,
  setPlayers,
  setTimeLimit,
} = gameSlice.actions;

describe('Redux, game actions', () => {
  it('filters invalid and truncates long player names', () => {
    const state = gameReducer(
      initialState,
      setPlayers([
        '',
        'player',
        'eric eric eric eric eric eric eric eric eric eric',
      ])
    );
    expect(state.players.names).toEqual(['player', 'eric eric eric eric eric']);
  });
  it('inits game with default players if none are present', () => {
    const state = gameReducer(initialState, initGame);
    expect(state).toMatchObject<DeepPartial<GameState>>({
      players: {
        names: ['Player 1'],
        scores: {
          'Player 1': {
            totalScore: 0,
            results: [],
          },
        },
      },
    });
  });
});

describe('Redux, game', () => {
  let state = initialState;
  it('passes e2e test', () => {
    state = gameReducer(state, setPlayers(['p1', 'p2']));
    state = gameReducer(state, setRounds(2));
    expect(state).toMatchSnapshot('Add players and set rounds');
    state = gameReducer(state, initGame);
    expect(state).toMatchSnapshot('Game initialized');
    /* Round 1 */
    state = gameReducer(state, startRound);
    expect(state).toMatchSnapshot('Started round 1');
    state = gameReducer(
      state,
      setPlayerScore({
        selected: null,
        initial: null,
      })
    );
    expect(state).toMatchSnapshot('Round 1, player 1 scored');
    state = gameReducer(
      state,
      setPlayerScore({
        selected: null,
        initial: null,
      })
    );
    expect(state).toMatchSnapshot('Round 1, player 2 scored');
    state = gameReducer(state, endRound);
    expect(state).toMatchSnapshot('Finished round 1');
    /* Round 2 */
    state = gameReducer(state, startRound);
    expect(state).toMatchSnapshot('Started round 2');
    state = gameReducer(
      state,
      setPlayerScore({
        selected: null,
        initial: null,
      })
    );
    expect(state).toMatchSnapshot('Round 2, player 1 scored');
    state = gameReducer(state, resetRound);
    expect(state).toMatchSnapshot('Round 2, reset');
    state = gameReducer(
      state,
      setPlayerScore({
        selected: null,
        initial: null,
      })
    );
    expect(state).toMatchSnapshot('Round 2, player 1 scored');
    state = gameReducer(
      state,
      setPlayerScore({
        selected: null,
        initial: null,
      })
    );
    expect(state).toMatchSnapshot('Round 2, player 2 scored');
    state = gameReducer(state, endRound);
    expect(state).toMatchSnapshot('Finished round 2, game ended');
  });
});
