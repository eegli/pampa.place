import {DeepPartial} from '@/utils/types';
import gameReducer, {gameSlice, GameState, initialState} from '../game.slice';

const {
  initGame,
  startRound,
  endRound,
  resetRound,
  setPlayerScore,
  setRounds,
  setPlayers,
} = gameSlice.actions;

describe('Redux, game', () => {
  let state = initialState;
  it('passes e2e test', () => {
    /* Initialization */
    state = gameReducer(
      state,
      setPlayers([
        '',
        'player',
        'eric eric eric eric eric eric eric eric eric eric',
      ])
    );
    expect(state.players).toEqual(['player', 'eric eric eric eric eric']);
    state = gameReducer(state, setPlayers(['p1', 'p2']));
    expect(state.players).toEqual(['p1', 'p2']);
    state = gameReducer(state, setRounds(2));
    expect(state).toMatchObject<DeepPartial<GameState>>({
      rounds: {
        total: 2,
      },
    });
    state = gameReducer(state, setPlayers([]));
    state = gameReducer(state, initGame);
    expect(state).toMatchObject<DeepPartial<GameState>>({
      players: ['Player 1'],
    });

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
