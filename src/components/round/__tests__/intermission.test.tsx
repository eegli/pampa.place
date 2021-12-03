import {createMockState, createMockStore, render} from '@/tests/test-utils';
import {RoundIntermission} from '../states/intermission';

const mockPush = jest.fn();

jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: mockPush,
    };
  },
}));

const mockRes = {
  data: {
    copyright: 'copyright',
    imageDate: 'sv image',
    links: [],
    location: {
      description: 'mock panorama description',
      pano: 'mock panorama id',
      shortDescription: null,
      latLng: {
        lat() {
          return 1;
        },
        lng() {
          return 2;
        },
      },
    },
  },
} as unknown as google.maps.StreetViewResponse;

jest
  .spyOn(google.maps.StreetViewService.prototype, 'getPanorama')
  .mockResolvedValue(mockRes);

describe('Round intermission', () => {
  it('fetches new random location at the start of round', async () => {
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
    expect(store.getState().position).toMatchSnapshot('new random location');
  });
});
