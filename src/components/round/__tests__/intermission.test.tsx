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

const streetViewServiceSpy = jest.spyOn(
  google.maps.StreetViewService.prototype,
  'getPanorama'
);

afterEach(() => {
  streetViewServiceSpy.mockClear();
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
    // Somehow this is necessary for the store to update.
    await new Promise(r => setTimeout(r, 0));
    expect(streetViewServiceSpy).toHaveBeenCalledTimes(1);
    expect(store.getState().position).toMatchSnapshot(
      'random sv request, fulfilled'
    );
  });
  it('new random location at the start of round (reject)', async () => {
    const mockResRejected: ValidationError = {
      code: 'ZERO_RESULTS',
      endpoint: 'google maps',
      message: 'unable to find sv',
      name: 'MapsRequestError',
      stack: 'stack',
    };

    streetViewServiceSpy.mockRejectedValue(mockResRejected);

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
    // Somehow this is necessary for the store to update.
    await new Promise(r => setTimeout(r, 0));
    expect(streetViewServiceSpy).toHaveBeenCalledTimes(50);
    expect(store.getState().position).toMatchSnapshot(
      'random sv request, rejected'
    );
  });
});
