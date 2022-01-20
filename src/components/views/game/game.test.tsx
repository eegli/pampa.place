import {
  createMockState,
  createMockStore,
  fireEvent,
  render,
  screen,
} from '@/tests/utils';
import * as timer from '../../../hooks/useTimer';
import {Play} from './game';

/* WORK IN PROGRESS */

describe('Play', () => {
  function getSubmitButton() {
    return screen.getByRole('button', {name: /submit/i});
  }
  it('has disabled submit button state', () => {
    const state = createMockState({
      position: {
        selectedPosition: null,
      },
    });
    const store = createMockStore(state);
    render(<Play />, store);
    const button = getSubmitButton();
    expect(button).toBeDisabled();
  });
  it('has enabled button state', () => {
    const state = createMockState({
      position: {
        selectedPosition: {
          lat: 1,
          lng: 1,
        },
      },
    });
    const store = createMockStore(state);
    render(<Play />, store);
    const button = getSubmitButton();
    expect(button).not.toBeDisabled();
  });
  it('dispatches no score when time runs out', () => {
    const useTimerSpy = jest.spyOn(timer, 'useTimer').mockImplementation(() => {
      return [0] as const;
    });
    const state = createMockState({
      position: {
        selectedPosition: null,
        initialPosition: {
          lat: 2,
          lng: 2,
        },
      },
      game: {
        players: ['player 1'],
        scores: [[]],
      },
    });
    const store = createMockStore(state);
    render(<Play />, store);
    expect(store.getState().game.scores).toMatchSnapshot('no score');
    useTimerSpy.mockRestore();
  });
  it('dispatches score when position is set', () => {
    const state = createMockState({
      position: {
        selectedPosition: {
          lat: 1,
          lng: 1,
        },
        initialPosition: {
          lat: 2,
          lng: 2,
        },
      },
      game: {
        players: ['player 1'],
        scores: [[]],
      },
    });
    const store = createMockStore(state);
    render(<Play />, store);
    fireEvent.click(getSubmitButton());
    expect(store.getState().game.scores).toMatchSnapshot('score');
  });
});
