import {createMockState, createMockStore} from '@/tests/utils';
import {endRound, initGame} from '../redux/game';

const eventSpy = jest.fn();
window.gtag = eventSpy;

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
    expect(eventSpy.mock.calls.at(-1)).toMatchInlineSnapshot(`
      [
        "event",
        "game_start",
        {
          "event_category": "game",
          "map_category": "test",
          "map_name": "my test map",
          "total_players": 1,
          "total_rounds": 1,
        },
      ]
    `);
    store.dispatch(endRound());
    expect(eventSpy).toHaveBeenCalledTimes(2);
    expect(eventSpy.mock.calls.at(-1)).toMatchInlineSnapshot(`
    [
      "event",
      "game_end",
      {
        "event_category": "game",
        "map_category": "test",
        "map_name": "my test map",
        "total_players": 1,
        "total_rounds": 1,
      },
    ]
  `);
  });
});
