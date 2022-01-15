import {act, render, screen} from '@/tests/utils';
import {PlayHeader} from './header';

const mockCallback = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
  jest.useRealTimers();
});

describe('Play header', () => {
  it('has disabled submit button state', () => {
    jest.useFakeTimers();
    render(<PlayHeader player="eric" timerCallback={mockCallback} />);

    expect(screen.getAllByRole('heading')[0]).toHaveTextContent(/eric/gi);
    expect(screen.getAllByRole('heading')[1]).toHaveTextContent(/1m/gi);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    const headings = screen.getAllByRole('heading');
    expect(headings[1]).toHaveTextContent(/59s/gi);
  });
});
