import {createMockState, createMockStore, render} from '@/tests/utils';
import * as GoogleMapsReactWrapper from '@googlemaps/react-wrapper';
import {AuthWrapper} from './auth';
import * as login from './login';

const mockRenderResult = <div />;

const wrapperSpy = jest
  .spyOn(GoogleMapsReactWrapper, 'Wrapper')
  .mockReturnValue(mockRenderResult);

const loginSpy = jest.spyOn(login, 'Login').mockReturnValue(mockRenderResult);

beforeEach(() => {
  wrapperSpy.mockClear();
});

describe('Auth wrapper', () => {
  ['123xyz', ''].forEach(apiKey => {
    it(`calls Google Maps wrapper with valid key ${apiKey}`, () => {
      const state = createMockState({
        app: {
          apiKey,
        },
      });
      const store = createMockStore(state);
      render(<AuthWrapper />, store);
      expect(wrapperSpy).toHaveBeenCalledTimes(1);
      expect(loginSpy).not.toHaveBeenCalled();
      expect(wrapperSpy.mock.calls[0][0].apiKey).toBe(apiKey);
      expect(wrapperSpy.mock.calls[0][0].version).toBe('3.47.2');
      expect(wrapperSpy.mock.results[0].value).toBe(mockRenderResult);
    });
  });

  it('returns login for invald key', () => {
    const state = createMockState({
      app: {
        apiKey: undefined,
      },
    });
    const store = createMockStore(state);
    render(<AuthWrapper />, store);
    expect(wrapperSpy).not.toHaveBeenCalled();
    expect(loginSpy).toHaveBeenCalledTimes(1);
  });
});
