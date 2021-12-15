import {Constants} from '@/config/constants';
import {
  createMockState,
  createMockStore,
  fireEvent,
  render,
  screen,
} from '@/tests/utils';
import {Header} from './header';

function getIconButton(iconName: string) {
  return screen.getByTestId(new RegExp(iconName, 'ig'));
}

describe('Header', () => {
  it('opens drawer', () => {
    render(<Header />);
    const menuButton = getIconButton('MenuIcon');
    expect(menuButton).toBeInTheDocument();
    fireEvent.click(menuButton);
    expect(screen.getByRole('presentation')).toBeInTheDocument();
  });
  it('has github link', () => {
    render(<Header />);
    const githubLink = screen.getByRole('link');
    expect(githubLink).toBeInTheDocument();
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
    let themeButton = getIconButton('ModeIcon');
    expect(themeButton).toBeInTheDocument();
    fireEvent.click(themeButton);
    expect(store.getState().app.theme).toBe('light');
    expect(window.localStorage.getItem(Constants.THEME_KEY)).toBe('light');
    unmount();
    render(<Header />, store);
    themeButton = getIconButton('ModeIcon');
    fireEvent.click(themeButton);
    expect(store.getState().app.theme).toBe('dark');
    expect(window.localStorage.getItem(Constants.THEME_KEY)).toBe('dark');
  });
});
