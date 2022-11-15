import {Constants} from '@/config/constants';
import {
  createMockState,
  createMockStore,
  fireEvent,
  render,
  screen,
} from '@/tests/utils';
import {Header} from './header';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Header', () => {
  it('opens drawer', () => {
    render(<Header />);
    const menuButton = screen.getByRole('button', {name: 'menu-btn'});
    fireEvent.click(menuButton);
    expect(screen.getByRole('presentation')).toBeInTheDocument();
  });
  it('has github link', () => {
    render(<Header />);
    const githubLink = screen.getByRole('link');
    expect(githubLink).toHaveAttribute(
      'href',
      'https://github.com/eegli/pampa.place'
    );
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener');
  });
  it('has theme toggle', () => {
    const state = createMockState({app: {theme: 'dark'}});
    const store = createMockStore(state);
    const {unmount} = render(<Header />, store);
    let themeButton = screen.getByRole('button', {name: 'theme-toggle-btn'});
    fireEvent.click(themeButton);
    expect(store.getState().app.theme).toBe('light');
    expect(window.localStorage.getItem(Constants.THEME_KEY)).toBe('light');
    unmount();
    render(<Header />, store);
    themeButton = screen.getByRole('button', {name: 'theme-toggle-btn'});
    fireEvent.click(themeButton);
    expect(store.getState().app.theme).toBe('dark');
    expect(window.localStorage.getItem(Constants.THEME_KEY)).toBe('dark');
  });
});
