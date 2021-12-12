import {
  createMockState,
  createMockStore,
  fireEvent,
  render,
  screen,
} from '@/tests/utils';
import router from 'next/router';
import {SpeedDialNav} from '../speed-dial/speed-dial';

const mockRouter = router as jest.Mocked<typeof router>;
mockRouter.push = jest.fn();

jest.mock('next/router', () => ({
  useRouter() {
    return mockRouter;
  },
}));

afterEach(() => {
  jest.clearAllMocks();
});

function getSpeedDialItem(key: 'theme' | 'restart' | 'home') {
  const speedDial = screen.getByRole('button');
  fireEvent.mouseOver(speedDial);
  const buttons = screen.getAllByRole('menuitem');
  switch (key) {
    case 'theme':
      return buttons[2];
    case 'home':
      return buttons[1];
    case 'restart':
      return buttons[0];
  }
}

describe('Speed dial', () => {
  it(`items render`, () => {
    render(<SpeedDialNav />);
    const speedDial = screen.getByRole('button');
    expect(speedDial).toBeInTheDocument();
    const items = screen.getAllByRole('menuitem');
    expect(items).toHaveLength(3);
  });
  it('has theme toggle', () => {
    const state = createMockState({app: {theme: 'dark'}});
    const store = createMockStore(state);
    const {unmount} = render(<SpeedDialNav />, store);
    let themeToggle = getSpeedDialItem('theme');
    fireEvent.click(themeToggle);
    expect(store.getState().app.theme).toBe('light');

    unmount();
    render(<SpeedDialNav />, store);
    themeToggle = getSpeedDialItem('theme');
    fireEvent.click(themeToggle);
    expect(store.getState().app.theme).toBe('dark');
  });
  it('has home navigation', () => {
    render(<SpeedDialNav />);
    const homeButton = getSpeedDialItem('home');
    fireEvent.click(homeButton);
    const confirmButtons = screen.getAllByRole('button');
    expect(confirmButtons).toHaveLength(2);
    fireEvent.click(confirmButtons[1]);
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });
  it('can restart round', async () => {
    const state = createMockState({
      game: {
        players: ['player2', 'player1'],
        rounds: {
          total: 3,
          current: 2,
          progress: 1,
        },
        scores: [
          [
            {name: 'player2', score: 0},
            {name: 'player1', score: 0},
          ],
          [{name: 'player2', score: 0}],
        ],
      },
    });
    const store = createMockStore(state);
    render(<SpeedDialNav />, store);
    const restartButton = getSpeedDialItem('restart');
    fireEvent.click(restartButton);
    const confirmButtons = screen.getAllByRole('button');
    fireEvent.click(confirmButtons[1]);
    expect(store.getState().game).toMatchSnapshot('reset round');
  });
});
