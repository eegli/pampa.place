import {
  createMockState,
  createMockStore,
  fireEvent,
  render,
  screen,
} from '@/tests/utils';
import {RootState} from '../../redux/store';
import {DeepPartial, PickActual} from '../../utils/types';
import {SpeedDialNav} from './speed-dial';

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

function expectDialogToBeInDocument() {
  expect(screen.getByRole('dialog')).toBeInTheDocument();
}

function expectDialogToBeGone() {
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
}

describe('Speed dial', () => {
  it('renders 3 items on hover', () => {
    render(<SpeedDialNav />);
    expect(screen.getAllByRole('menuitem')).toHaveLength(3);
  });
  it('has theme toggle', () => {
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
  it('has home navigation', () => {
    render(<SpeedDialNav />);
    hoverSpeedDial();
    const homeButton = screen.getByRole('menuitem', {name: /home/i});
    fireEvent.click(homeButton);
    expectDialogToBeInDocument();
    const cancelButton = screen.getByRole('button', {name: /cancel/i});
    fireEvent.click(cancelButton);
    expectDialogToBeGone();
    fireEvent.click(homeButton);
    const abortGameButton = screen.getByRole('button', {name: /abort game/i});
    fireEvent.click(abortGameButton);
    expectDialogToBeGone();
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/');
  });
  it('can restart round', () => {
    // Second round, second player's turn
    const store = createMockStore(
      createMockState({
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
      })
    );
    render(<SpeedDialNav />, store);
    hoverSpeedDial();
    const restartButton = screen.getByRole('menuitem', {name: /restart/i});
    fireEvent.click(restartButton);
    expectDialogToBeInDocument();
    const cancelButton = screen.getByRole('button', {name: /cancel/i});
    fireEvent.click(cancelButton);
    expectDialogToBeGone();
    fireEvent.click(restartButton);
    const restartRoundButton = screen.getByRole('button', {
      name: /restart round/i,
    });
    fireEvent.click(restartRoundButton);
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
