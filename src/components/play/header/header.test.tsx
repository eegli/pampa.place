import {
  act,
  createMockState,
  createMockStore,
  render,
  screen,
} from '@/tests/utils';
import {PlayHeader} from './header';

const mockCallback = jest.fn();

jest.useFakeTimers();

afterEach(() => {
  jest.clearAllMocks();
});

describe('Play header', () => {
  it('displays time remaining and invokes callback', () => {
    const state = createMockState({game: {timeLimit: 10}});
    const store = createMockStore(state);
    render(<PlayHeader player="eric" timerCallback={mockCallback} />, store);
    expect(screen.getAllByRole('heading')[0]).toHaveTextContent(/eric/gi);
    expect(screen.getAllByRole('heading')[1]).toHaveTextContent(/10s/gi);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    const headings = screen.getAllByRole('heading');
    expect(headings[1]).toHaveTextContent(/9s/gi);
    act(() => {
      jest.advanceTimersByTime(60 * 1000);
    });
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
  it('handles unlimited time mode', () => {
    const state = createMockState({game: {timeLimit: -1}});
    const store = createMockStore(state);
    render(<PlayHeader player="eric" timerCallback={mockCallback} />, store);
    expect(screen.getAllByRole('heading')[0]).toHaveTextContent(/eric/gi);
    expect(screen.getAllByRole('heading')[1]).toHaveTextContent('∞');
    act(() => {
      jest.advanceTimersByTime(60 * 1000);
    });
    expect(mockCallback).not.toHaveBeenCalled();
  });
});
