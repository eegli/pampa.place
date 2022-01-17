import {
  act,
  createMockState,
  createMockStore,
  fireEvent,
  render,
  screen,
} from '@/tests/utils';
import * as Dialog from '../../feedback/dialog';
import {SpeedDialNav} from './speed-dial';

const dialogSpy = jest.spyOn(Dialog, 'Dialog');
const mockPush = jest.fn();

jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: mockPush,
    };
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

function hoverSpeedDial() {
  const speedDial = screen.getByRole('button', {name: 'speed-dial-menu'});
  fireEvent.mouseOver(speedDial);
}

function expectDialogToBeGone() {
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
}

describe('Speed dial', () => {
  it(`items render`, () => {
    render(<SpeedDialNav />);
    screen.getByRole('button');
    const items = screen.getAllByRole('menuitem');
    expect(items).toHaveLength(3);
  });
  it('has theme toggle', () => {
    const state = createMockState({app: {theme: 'dark'}});
    const store = createMockStore(state);
    const {unmount} = render(<SpeedDialNav />, store);
    let toggleButton = screen.getByRole('menuitem', {name: 'toggle-theme'});
    fireEvent.click(toggleButton);
    expect(store.getState().app.theme).toBe('light');
    unmount();
    render(<SpeedDialNav />, store);
    toggleButton = screen.getByRole('menuitem', {name: 'toggle-theme'});
    fireEvent.click(toggleButton);
    expect(store.getState().app.theme).toBe('dark');
  });
  it('has home navigation', () => {
    render(<SpeedDialNav />);
    hoverSpeedDial();
    const homeButton = screen.getByRole('menuitem', {name: 'home'});
    fireEvent.click(homeButton);
    expect(dialogSpy).toHaveBeenCalledTimes(1);
    expect(dialogSpy.mock.calls[0][0]).toMatchSnapshot(
      'home confirmation dialog'
    );
    act(() => {
      dialogSpy.mock.calls[0][0].onCancelCallback();
    });
    expectDialogToBeGone();
    fireEvent.click(homeButton);
    act(() => {
      dialogSpy.mock.calls[0][0].onConfirmCallback();
    });
    expectDialogToBeGone();
    expect(mockPush).toHaveBeenCalledWith('/');
  });
  it('can restart round', () => {
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
    hoverSpeedDial();
    const restartButton = screen.getByRole('menuitem', {name: 'restart'});
    fireEvent.click(restartButton);
    expect(dialogSpy).toHaveBeenCalledTimes(1);
    expect(dialogSpy.mock.calls[0][0]).toMatchSnapshot(
      'restart confirmation dialog'
    );
    act(() => {
      dialogSpy.mock.calls[0][0].onCancelCallback();
    });
    expectDialogToBeGone();
    fireEvent.click(restartButton);
    act(() => {
      dialogSpy.mock.calls[0][0].onConfirmCallback();
    });
    expectDialogToBeGone();
    expect(store.getState().game).toMatchSnapshot('reset round');
  });
});
