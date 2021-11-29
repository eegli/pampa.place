import {
  createMockState,
  createMockStore,
  render,
  screen,
} from '@/tests/test-utils';
import React from 'react';
import RoundResult from '../round.result';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
}));

describe('Round end', () => {
  it('has submit button', () => {
    const state = createMockState({
      game: {
        players: ['1', '2'],
        scores: [
          [
            {name: '1', score: 2, selected: null, dist: 1},
            {name: '1', score: 4, selected: null, dist: 2},
          ],
          [
            {name: '2', score: 6, selected: null, dist: 3},
            {name: '2', score: 1, selected: null, dist: 2},
          ],
        ],
      },
    });

    const store = createMockStore(state);
    render(<RoundResult />, store);
    expect(screen).toMatchSnapshot();
  });
});
