import {
  createMockState,
  createMockStore,
  fireEvent,
  render,
  screen,
} from '@/tests/utils';
import {ValidationError} from '../../../redux/position/thunks';
import {RoundIntermission} from '../states/intermission';

const mockPush = jest.fn();

jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: mockPush,
    };
  },
}));

const getPanoramSpy = jest.spyOn(
  google.maps.StreetViewService.prototype,
  'getPanorama'
);

afterEach(() => {
  jest.resetAllMocks();
});

describe('Round intermission, ', () => {
  it('requests new street view location, fulfilled', async () => {
    const state = createMockState({
      game: {
        players: ['player 1', 'player 2'],
        rounds: {
          total: 3,
          current: 1,
          // If round progress is 0, get a new location
          progress: 0,
        },
      },
      position: {
        initialPosition: null,
      },
    });
    const store = createMockStore(state);
    render(<RoundIntermission />, store);

    // There seems to be a race condition with the store updating.
    // Resolve before calling store.getState()
    await new Promise(r => setTimeout(r, 0));
    const button = screen.getAllByRole('button')[0];
    expect(button).toHaveTextContent(/start/gi);
    fireEvent.click(button);
    expect(store.getState().game.status).toMatchInlineSnapshot(
      `"ROUND_ONGOING"`
    );
    expect(getPanoramSpy).toHaveBeenCalledTimes(1);
    expect(store.getState().position).toMatchSnapshot('sv request, fulfilled');
  });
  it('requests new street view location, rejected', async () => {
    const mockResRejected: ValidationError = {
      code: 'ZERO_RESULTS',
      endpoint: 'google maps',
      message: 'unable to find sv',
      name: 'MapsRequestError',
      stack: 'stack',
    };
    getPanoramSpy.mockRejectedValue(mockResRejected);
    const state = createMockState({
      game: {
        players: ['player 1', 'player 2'],
        rounds: {
          total: 3,
          current: 1,
          progress: 0,
        },
      },
      position: {
        initialPosition: null,
      },
    });
    const store = createMockStore(state);
    render(<RoundIntermission />, store);
    await new Promise(r => setTimeout(r, 0));
    expect(getPanoramSpy).toHaveBeenCalledTimes(50);
    expect(store.getState().position).toMatchSnapshot('sv request, rejected');
  });
  it('requests new street view location, pending', async () => {
    const state = createMockState({
      game: {
        players: ['player 1', 'player 2'],
        rounds: {
          total: 3,
          current: 1,
          progress: 0,
        },
      },
      position: {
        initialPosition: null,
      },
    });
    const store = createMockStore(state);
    render(<RoundIntermission />, store);
    const button = screen.getAllByRole('button')[0];
    expect(button).toHaveTextContent(/getting/gi);
    expect(button).toHaveAttribute('disabled');
    fireEvent.click(button);
    expect(getPanoramSpy).toHaveBeenCalledTimes(1);
    expect(store.getState().position).toMatchSnapshot('sv request, pending');
  });
});
