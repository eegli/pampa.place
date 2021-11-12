import {RootState, store} from '../../redux.store';
import * as selectors from '../game.selectors';

describe('Redux, game selectors', () => {
  it('calculates round scores', () => {
    const state: RootState = {
      ...store.getState(),
      game: {
        ...store.getState().game,
        players: ['Player 1', 'Player 2'],
        scores: [
          [
            {name: 'Player 1', selected: null, dist: 2, score: 10},
            {name: 'Player 2', selected: null, dist: 2, score: 5},
          ],
          [
            {name: 'Player 1', selected: null, dist: 2, score: 20},
            {name: 'Player 2', selected: null, dist: 2, score: 10},
          ],
        ],
        rounds: {
          total: 2,
          current: 1,
          progress: 2,
        },
      },
    };

    expect(selectors.getRoundScores(state)).toMatchSnapshot();
  });
});
