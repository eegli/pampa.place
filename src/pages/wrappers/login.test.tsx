import {
  createMockState,
  createMockStore,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@/tests/utils';
import {AuthRes} from '../api/auth.page';
import {Login} from './login';

const mockFetch = jest.fn() as jest.MockedFunction<typeof global.fetch>;

mockFetch.mockImplementation(url => {
  return new Promise((resolve, reject) => {
    if (url.toString().includes('api/auth?')) {
      // @ts-expect-error - no need to fully mock the fetch API
      return resolve({
        json: () => Promise.resolve({apikey: 'server api key'} as AuthRes),
      });
    }
    return reject();
  });
});

global.fetch = mockFetch;

describe('Login', () => {
  function getElem(
    elem: 'apiKeyInput' | 'passwordInput' | 'devModeButton' | 'enterButton'
  ) {
    switch (elem) {
      case 'apiKeyInput':
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
    expect(getElem('apiKeyInput')).toBeInTheDocument();
    expect(getElem('passwordInput')).toBeInTheDocument();
    expect(getElem('devModeButton')).toBeInTheDocument();
    expect(getElem('enterButton')).toBeInTheDocument();
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
  it('allows entering via dev mode', () => {
    const state = createMockState();
    const store = createMockStore(state);
    render(<Login />, store);
    const devModeButton = getElem('devModeButton');
    fireEvent.click(devModeButton);
    expect(store.getState().app.apiKey).toBe('');
  });
  it('allows entering via own api key', () => {
    const state = createMockState();
    const store = createMockStore(state);
    render(<Login />, store);
    const apiKeyInput = getElem('apiKeyInput');
    const enterButton = getElem('enterButton');
    fireEvent.change(apiKeyInput, {target: {value: 'user api key'}});
    fireEvent.click(enterButton);
    expect(store.getState().app.apiKey).toBe('user api key');
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
      expect(store.getState().app.apiKey).toBe('server api key');
    });
  });
});
