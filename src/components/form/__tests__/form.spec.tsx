import gameConfig from '@config/game';
import { fireEvent } from '@testing-library/dom';
import { render, screen } from '@tests/test-utils';
import React from 'react';
import Form from '../form';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
}));

const dispatchSpy = jest.fn();

jest
  .spyOn(require('../../../redux/hooks'), 'useAppDispatch')
  .mockReturnValue(dispatchSpy);

beforeEach(() => {
  dispatchSpy.mockClear();
});

function queryPlayers() {
  return screen.queryAllByLabelText(/^player/i);
}

function querySubmitButton() {
  return screen.getByRole('button', { name: /start/i });
}

describe('Form', () => {
  it('has submit button', () => {
    render(<Form />);
    const submit = querySubmitButton();
    expect(submit).toBeInTheDocument();
  });
});

describe('Form - Player name input', () => {
  it('always renders at least one player input field', () => {
    render(<Form />);
    expect(queryPlayers()).toHaveLength(1);
    expect(queryPlayers()[0]).toHaveValue('');

    fireEvent.change(queryPlayers()[0], { target: { value: 'eric' } });
    expect(queryPlayers()[0]).toHaveValue('eric');
  });
  it('does not create more inputs than defined', () => {
    render(<Form />);
    for (let i = 0; i < gameConfig.maxPlayers; i++) {
      const inputs = queryPlayers();
      fireEvent.change(inputs[i], { target: { value: `player ${i}` } });
    }
    expect(queryPlayers()).toHaveLength(gameConfig.maxPlayers);
  });
  it('filters invalid players', () => {
    render(<Form />);
    fireEvent.change(queryPlayers()[0], { target: { value: 'a' } });
    fireEvent.change(queryPlayers()[1], { target: { value: 'b' } });
    expect(queryPlayers()).toHaveLength(3);

    fireEvent.change(queryPlayers()[1], { target: { value: '' } });
    fireEvent.change(queryPlayers()[0], { target: { value: 'aa' } });
    expect(queryPlayers()).toHaveLength(2);
  });

  it('does not submit if there are not players', () => {
    render(<Form />);
    const submit = querySubmitButton();
    fireEvent.click(submit);
    expect(dispatchSpy).not.toHaveBeenCalled();
  });
  it('submits if there is at least one player name', () => {
    render(<Form />);
    const submit = querySubmitButton();
    fireEvent.change(queryPlayers()[0], { target: { value: 'eric' } });
    fireEvent.click(submit);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
  });
});
