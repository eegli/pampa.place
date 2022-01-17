import {STATUS} from '@/redux/game';
import {createMockState, createMockStore, render} from '@/tests/utils';
import {GamePage, utils} from './game.page';

const mockRender = jest.fn(() => null);

jest.spyOn(utils, 'render').mockImplementation(mockRender);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Game page', () => {
  Object.keys(STATUS).forEach(status => {
    it(`renders each status, status ${status}`, () => {
      const state = createMockState({
        game: {
          // @ts-expect-error - force enum
          status: STATUS[status],
        },
      });
      const store = createMockStore(state);
      render(<GamePage />, store);
      expect(mockRender).toHaveBeenCalledWith(status);
    });
  });

  it(`position error`, () => {
    const state = createMockState({
      position: {
        error: {
          code: 'ZERO_RESULTS',
          name: 'MapsRequestError',
          endpoint: 'maps',
          message: 'error',
        },
      },
    });
    const store = createMockStore(state);
    render(<GamePage />, store);
    expect(mockRender).not.toHaveBeenCalled();
  });
});
