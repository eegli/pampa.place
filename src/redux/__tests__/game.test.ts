import { AnyAction } from 'redux';
import gameReducer, { gameSlice, initialState } from '../slices/game';

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

describe('Redux, game state', () => {
  it('defines a marker color for each player', () => {
    const state = initialState;
    state.players.names = ['eric'];

    expect(gameReducer(state, {} as AnyAction)).toEqual(initialState);
  });
});
