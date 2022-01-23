import {fireEvent, render, screen, waitFor} from '@/tests/utils';
import router from 'next/router';
import HomePage from 'src/pages/index.page';

const mockRouter: Partial<typeof router> = {
  push: jest.fn().mockResolvedValue(true),
};

jest.spyOn(require('next/router'), 'useRouter').mockReturnValue(mockRouter);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Integration, form submission', () => {
  it('starts game with default values', async () => {
    render(<HomePage />);
    const submit = screen.getByRole('button', {name: /start/i});
    fireEvent.click(submit);
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/game');
    });
  });
  it('can reset fields', () => {
    render(<HomePage />);
    let playerInput = screen.getAllByLabelText(/^player \d$/i);
    fireEvent.change(playerInput[0], {
      target: {value: 'PlayerName'},
    });
    const reset = screen.getByRole('button', {name: /reset/i});
    fireEvent.click(reset);
    playerInput = screen.getAllByLabelText(/^player \d$/i);
    expect(playerInput[0]).toHaveValue('');
  });
});
