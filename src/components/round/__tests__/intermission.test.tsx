import {createMockState, createMockStore, render} from '@/tests/test-utils';
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

jest.spyOn(global.console, 'warn').mockImplementation(() => jest.fn());

const getPanoramSpy = jest.spyOn(
  google.maps.StreetViewService.prototype,
  'getPanorama'
);

afterEach(() => {
  getPanoramSpy.mockClear();
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
});
