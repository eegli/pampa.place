import {
  act,
  createMockState,
  createMockStore,
  fireEvent,
  render,
  screen,
} from '@/tests/utils';
import {RootState} from '../../redux/store';
import {DeepPartial, PickActual} from '../../utils/types';
import * as Dialog from '../feedback/dialog';
import {SpeedDialNav} from './speed-dial';

const dialogSpy = jest.spyOn(Dialog, 'Dialog');

const mockPush = jest.fn().mockResolvedValue(true);

jest.spyOn(require('next/router'), 'useRouter').mockReturnValue({
  push: mockPush,
});

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

// TODO fix
describe('Speed dial', () => {
  it.skip('items render', () => {
    render(<SpeedDialNav />);
    screen.getByRole('button');
    const items = screen.getAllByRole('menuitem');
    expect(items).toHaveLength(3);
  });
  it.skip('has theme toggle', () => {
    const state = createMockState({app: {theme: 'dark'}});
    const store = createMockStore(state);
    const {unmount} = render(<SpeedDialNav />, store);
    let toggleButton = screen.getByRole('menuitem', {name: /lights/i});
    fireEvent.click(toggleButton);
    expect(store.getState().app.theme).toBe('light');
    unmount();
    render(<SpeedDialNav />, store);
    toggleButton = screen.getByRole('menuitem', {name: /lights/i});
    fireEvent.click(toggleButton);
    expect(store.getState().app.theme).toBe('dark');
  });
  it.skip('has home navigation', () => {
    render(<SpeedDialNav />);
    hoverSpeedDial();
    const homeButton = screen.getByRole('menuitem', {name: /home/i});
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
  it.skip('can restart round', () => {
    // Second round, second player's turn
    const state = createMockState({
      game: {
        players: ['player2', 'player1'],
        rounds: {
          total: 2,
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
    const restartButton = screen.getByRole('menuitem', {name: /restart/i});
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
    // Second round is restarted, first player's turn again
    expect(store.getState().game).toMatchObject<
      DeepPartial<PickActual<RootState, 'game'>>
    >({
      players: ['player1', 'player2'],
      rounds: {
        total: 2,
        current: 2,
        progress: 0,
      },
      scores: [
        [
          {name: 'player2', score: 0},
          {name: 'player1', score: 0},
        ],
        [],
      ],
    });
  });
});
