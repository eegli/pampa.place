import {Constants} from '@/config/constants';
import {fireEvent, render, screen, waitFor} from '@/tests/utils';
import * as GoogleMapsReactWrapper from '@googlemaps/react-wrapper';
import {AuthWrapper} from 'src/pages/wrappers/auth';
import {setupGlobalFetch} from './utils';

const mockchildren = <div data-testid="mock-children" />;

// As soon as ready, delete auth and login unit tests

jest
  .spyOn(GoogleMapsReactWrapper, 'Wrapper')
  .mockImplementation(props => <>{props.children}</>);

beforeAll(() => {
  setupGlobalFetch();
});

beforeEach(() => {
  window.sessionStorage.clear();
  jest.clearAllMocks();
});

const elements = {
  apikeyInput: () => screen.getByRole('textbox', {name: /api key/i}),
  passwordInput: () => screen.getByLabelText(/password/i),
  devModeBtn: () => screen.getByRole('button', {name: /dev/i}),
  enterBtn: () => screen.getByRole('button', {name: /enter/i}),
};

describe('Integration, app login', () => {
  it('logs in automatically with api key in session storage', () => {
    window.sessionStorage.setItem(Constants.SESSION_API_KEY, 'local-api-key');
    render(<AuthWrapper>{mockchildren}</AuthWrapper>);
    expect(screen.getByTestId('mock-children')).toBeInTheDocument();
  });
  it('allows login with password', async () => {
    render(<AuthWrapper>{mockchildren}</AuthWrapper>);
    expect(screen.queryByTestId('mock-children')).not.toBeInTheDocument();
    const enterButton = elements.enterBtn();
    const passwordInput = elements.passwordInput();
    expect(passwordInput).not.toBeInvalid();
    fireEvent.click(enterButton);
    expect(passwordInput).toBeInvalid();
    fireEvent.change(passwordInput, {target: {value: 'password'}});
    expect(passwordInput).not.toBeInvalid();
    fireEvent.click(enterButton);
    await waitFor(() => {
      expect(screen.getByTestId('mock-children')).toBeInTheDocument();
    });
    expect(window.sessionStorage.getItem(Constants.SESSION_API_KEY)).toBe(
      'server api key'
    );
  });
  it('allows login with own api key', () => {
    render(<AuthWrapper>{mockchildren}</AuthWrapper>);
    expect(screen.queryByTestId('mock-children')).not.toBeInTheDocument();
    fireEvent.change(elements.apikeyInput(), {target: {value: 'user api key'}});
    fireEvent.click(elements.enterBtn());
    expect(screen.getByTestId('mock-children')).toBeInTheDocument();
    expect(window.sessionStorage.getItem(Constants.SESSION_API_KEY)).toBe(
      'user api key'
    );
  });
  it('allows login with dev mode', () => {
    render(<AuthWrapper>{mockchildren}</AuthWrapper>);
    expect(screen.queryByTestId('mock-children')).not.toBeInTheDocument();
    fireEvent.click(elements.devModeBtn());
    expect(screen.getByTestId('mock-children')).toBeInTheDocument();
    expect(window.sessionStorage.getItem(Constants.SESSION_API_KEY)).toBe('');
  });
});
