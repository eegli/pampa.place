import {createMockState, createMockStore, render} from '@/tests/utils';
import * as hooks from 'react-use';
import {AuthRes} from '../../../pages/api/auth.page';
import {AuthWrapper} from '../auth.wrapper';

jest.mock('react-use');

const mockFetch = jest.fn() as jest.MockedFunction<typeof global.fetch>;

// @ts-expect-error - no need to fully mock the fetch API
mockFetch.mockImplementation(() => {
  return Promise.resolve({
    json: () => Promise.resolve({apikey: ''} as AuthRes),
  });
});

const storageSpy = jest.spyOn(hooks, 'useSessionStorage');

global.fetch = mockFetch;

describe('Login, session storage handling', () => {
  it('ready session storage key (valid 1)', () => {
    const state = createMockState({
      app: {
        apiKey: undefined,
      },
    });
    const store = createMockStore(state);
    storageSpy.mockReturnValue(['123', jest.fn()]);
    render(<AuthWrapper />, store);
    expect(store.getState().app.apiKey).toBe('123');
  });
});
