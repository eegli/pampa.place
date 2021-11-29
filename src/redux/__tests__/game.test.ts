import {createMockState} from '@/tests/test-utils';
import {DeepPartial} from '@/utils/types';
import game, {
  endRound,
  GameState,
  initGame,
  resetRound,
  setPlayers,
  setPlayerScore,
  setRounds,
  startRound,
} from '../game';

describe('Redux, game', () => {
  let state = createMockState().game;
  it('passes e2e test', () => {
    /* Initialization */
    state = game.reducer(state, setPlayers(['p1', 'p2']));
    expect(state.players).toEqual(['p1', 'p2']);
    state = game.reducer(state, setRounds(2));
    expect(state).toMatchObject<DeepPartial<GameState>>({
      rounds: {
        total: 2,
      },
    });
    state = game.reducer(state, setPlayers([]));
    state = game.reducer(state, initGame);
    expect(state).toMatchObject<DeepPartial<GameState>>({
      players: ['Player 1'],
    });

    /* Round 1 */
    state = game.reducer(state, startRound);
    expect(state).toMatchSnapshot('Started round 1');
    state = game.reducer(
      state,
      setPlayerScore({
        selected: null,
        initial: null,
      })
    );
    expect(state).toMatchSnapshot('Round 1, player 1 scored');
    state = game.reducer(
      state,
      setPlayerScore({
        selected: null,
        initial: null,
      })
    );
    expect(state).toMatchSnapshot('Round 1, player 2 scored');
    state = game.reducer(state, endRound);
    expect(state).toMatchSnapshot('Finished round 1');
    /* Round 2 */
    state = game.reducer(state, startRound);
    expect(state).toMatchSnapshot('Started round 2');
    state = game.reducer(
      state,
      setPlayerScore({
        selected: null,
        initial: null,
      })
    );
    expect(state).toMatchSnapshot('Round 2, player 1 scored');
    state = game.reducer(state, resetRound);
    expect(state).toMatchSnapshot('Round 2, reset');
    state = game.reducer(
      state,
      setPlayerScore({
        selected: null,
        initial: null,
      })
    );
    expect(state).toMatchSnapshot('Round 2, player 1 scored');
    state = game.reducer(
      state,
      setPlayerScore({
        selected: null,
        initial: null,
      })
    );
    expect(state).toMatchSnapshot('Round 2, player 2 scored');
    state = game.reducer(state, endRound);
    expect(state).toMatchSnapshot('Finished round 2, game ended');
  });
});
