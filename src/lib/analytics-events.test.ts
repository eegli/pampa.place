import * as analytics from '@/lib/analytics-events';
import {createMockState, createMockStore} from '@/tests/utils';
import {endRound, initGame} from '../redux/game';

const eventSpy = jest.spyOn(analytics, 'gaevent').mockImplementation(jest.fn());

beforeEach(() => {
  jest.clearAllMocks();
});

// Maybe TODO move to integration tests
describe('Analytics events', () => {
  it('logs start and end game events', () => {
    const state = createMockState({
      game: {
        rounds: {
          total: 1,
        },
      },
    });
    const store = createMockStore(state);
    store.dispatch(initGame());
    expect(eventSpy).toHaveBeenCalledTimes(1);
    expect(eventSpy.mock.calls[0][0]).toMatchObject<analytics.GameEvent>({
      eventName: 'game_start',
      category: 'game',
      payload: expect.anything(),
    });
    store.dispatch(endRound());
    expect(eventSpy).toHaveBeenCalledTimes(2);
    expect(eventSpy.mock.calls[1][0]).toMatchObject<analytics.GameEvent>({
      eventName: 'game_end',
      category: 'game',
      payload: expect.anything(),
    });
  });
});
