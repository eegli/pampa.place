import {Constants} from '@/config/constants';
import {
  createMockState,
  createMockStore,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@/tests/utils';
import * as ReactWrapper from '@googlemaps/react-wrapper';
import {AuthRes} from '../api/auth.page';
import {Login} from './login';

// The login component saves the key in the sessionStorage. Clear in
// between tests

const reactWrapperSpy = jest.spyOn(ReactWrapper, 'Wrapper');
const mockFetch = jest.fn() as jest.MockedFunction<typeof global.fetch>;

mockFetch.mockImplementation(url => {
  return new Promise((resolve, reject) => {
    if (url.toString().includes('api/auth?pw=')) {
      // @ts-expect-error - no need to fully mock the fetch API
      return resolve({
        json: () => Promise.resolve({apikey: 'server api key'} as AuthRes),
      });
    }
    return reject();
  });
});

global.fetch = mockFetch;

// The login component saves the key in the sessionStorage. Clear in
// between tests
afterEach(() => {
  reactWrapperSpy.mockClear();
  window.sessionStorage.clear();
});

describe('Login', () => {
  function getElem(
    elem: 'ownKeyInput' | 'passwordInput' | 'devModeButton' | 'enterButton'
  ) {
    switch (elem) {
      case 'ownKeyInput':
        return screen.getByLabelText(/api/gi);
      case 'passwordInput':
        return screen.getByLabelText(/password/gi);
      case 'devModeButton':
        return screen.getByRole('button', {name: /dev/gi});
      case 'enterButton':
        return screen.getByRole('button', {name: /enter/gi});
    }
  }

  it('has all input fields and buttons', () => {
    render(<Login />);
    // Each function throws with getBy if the element is not present
    getElem('ownKeyInput');
    getElem('passwordInput');
    getElem('devModeButton');
    getElem('enterButton');
  });
  it('displays error message if no input is provided', async () => {
    render(<Login />);
    const enterButton = getElem('enterButton');
    const passwordInput = getElem('passwordInput');
    fireEvent.click(enterButton);
    await waitFor(() => {
      expect(passwordInput).toBeInvalid();
    });
  });
  it('allows entering via dev mode', async () => {
    const state = createMockState();
    const store = createMockStore(state);
    render(<Login />, store);
    const devModeButton = getElem('devModeButton');
    fireEvent.click(devModeButton);
    expect(store.getState().app.apiKey).toBe('');
    const keyInStorage = window.sessionStorage.getItem(
      Constants.SESSION_APIKEY_KEY
    );
    expect(keyInStorage).toBe('');
  });
  it('allows entering via own api key', () => {
    const state = createMockState();
    const store = createMockStore(state);
    render(<Login />, store);
    const ownKeyInput = getElem('ownKeyInput');
    const enterButton = getElem('enterButton');
    fireEvent.change(ownKeyInput, {target: {value: 'user api key'}});
    fireEvent.click(enterButton);
    expect(store.getState().app.apiKey).toBe('user api key');
    const keyInStorage = window.sessionStorage.getItem(
      Constants.SESSION_APIKEY_KEY
    );
    expect(keyInStorage).toBe('user api key');
  });
  it('allows entering via server password', async () => {
    const state = createMockState();
    const store = createMockStore(state);
    render(<Login />, store);
    const passwordInput = getElem('passwordInput');
    const enterButton = getElem('enterButton');
    fireEvent.change(passwordInput, {target: {value: 'password'}});
    fireEvent.click(enterButton);
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
    expect(store.getState().app.apiKey).toBe('server api key');
    const keyInStorage = window.sessionStorage.getItem(
      Constants.SESSION_APIKEY_KEY
    );
    expect(keyInStorage).toBe('server api key');
  });
});
