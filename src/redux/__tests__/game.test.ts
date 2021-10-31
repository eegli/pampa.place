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
  it('creates game with default players if none are present', () => {
    const state = initialState;
    expect(gameReducer(state, initGame)).toMatchSnapshot();
  });
});
