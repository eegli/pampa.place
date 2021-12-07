import {createMockState, createMockStore, render} from '@/tests/utils';
import * as GoogleMapsReactWrapper from '@googlemaps/react-wrapper';
import {AuthWrapper} from './auth';

const wrapperSpy = jest
  .spyOn(GoogleMapsReactWrapper, 'Wrapper')
  .mockImplementation(() => <div />);

afterEach(() => {
  wrapperSpy.mockClear();
});

describe('Auth wrapper', () => {
  it('inits Google Maps with api key 1', () => {
    const state = createMockState({
      app: {
        apiKey: 'apiKey',
      },
    });
    const store = createMockStore(state);
    render(<AuthWrapper />, store);
    expect(wrapperSpy).toHaveBeenCalledTimes(1);
  });
  it('inits Google Maps with api key 2', () => {
    const state = createMockState({
      app: {
        apiKey: '',
      },
    });
    const store = createMockStore(state);
    render(<AuthWrapper />, store);
    expect(wrapperSpy).toHaveBeenCalledTimes(1);
  });
  it('does not init Google Maps without api key', () => {
    const state = createMockState({
      app: {
        apiKey: undefined,
      },
    });
    const store = createMockStore(state);
    render(<AuthWrapper />, store);
    expect(wrapperSpy).not.toHaveBeenCalled();
  });
  it('renders children on success', async () => {
    const state = createMockState({
      app: {
        apiKey: 'key',
      },
    });
    const store = createMockStore(state);
    render(
      <AuthWrapper>
        <div data-testid="rendered"></div>
      </AuthWrapper>,
      store
    );
    expect(wrapperSpy.mock.calls[0][0]).toMatchSnapshot('Google maps init');
  });
});
