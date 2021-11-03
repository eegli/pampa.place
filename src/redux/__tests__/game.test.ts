import { DeepPartial, PickActualPartial } from '@/utils/types';
import gameReducer, {
  gameSlice,
  GameState,
  initialState,
} from '../slices/game';

export const {
  reset,
  initGame,
  startRound,
  finishRound,
  resetRound,
  setPlayerScore,
  setRounds,
  setMap,
  setPlayers,
  setTimeLimit,
} = gameSlice.actions;

describe('Redux, game state e2e', () => {
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
    expect(state.rounds).toMatchObject<PickActualPartial<GameState, 'rounds'>>({
      current: 1,
      progress: 0,
    });
    expect(state.status).toEqual('PENDING_PLAYER');
  });
  it('sets up and inits game', () => {
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
});

// TODO e2e
describe('Redux, game state', () => {
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
    expect(state.rounds).toMatchObject<PickActualPartial<GameState, 'rounds'>>({
      current: 1,
      progress: 0,
    });
    expect(state.status).toEqual('PENDING_PLAYER');
  });
  it('sets player scores and resets round', () => {
    let state = gameReducer(initialState, initGame);
    state = gameReducer(
      state,
      setPlayerScore({ selected: null, initial: null })
    );
    expect(state).toMatchSnapshot('Set score, round 1');
    let secondState = gameReducer(
      state,
      setPlayerScore({ selected: null, initial: null })
    );
    secondState = gameReducer(secondState, finishRound);
    expect(secondState).toMatchSnapshot('Set score, round 2');
    let thirdState = gameReducer(secondState, resetRound);
    expect(thirdState).toMatchSnapshot('Reset round 2');
    expect(thirdState).toEqual(state);
  });
  it('finishes game or round depending on progress', () => {
    let state: GameState = {
      ...initialState,
      rounds: {
        total: 1,
        current: 0,
        progress: 1,
      },
    };
    state = gameReducer(state, finishRound);
    expect({ ...state.rounds, status: state.status }).toMatchSnapshot();
    state = gameReducer(state, finishRound);
    expect({ ...state.rounds, status: state.status }).toMatchSnapshot();
  });
});
