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

function querySubmitButton() {
  return screen.getByRole('button', { name: /start/i });
}

describe('Form', () => {
  function queryRoundSelect() {
    return screen.getAllByRole('button', { name: /round/i });
  }

  it('has submit button', () => {
    render(<Form />);
    const submit = querySubmitButton();
    expect(submit).toBeInTheDocument();
  });

  it('renders a round select options', () => {
    render(<Form />);
    expect(queryRoundSelect()).toHaveLength(3);
    expect(queryRoundSelect()[0]).toHaveValue('');
  });
});

describe('Form - Player name input', () => {
  function queryPlayerInput() {
    return screen.queryAllByLabelText(/^player/i);
  }

  it('always renders at least one player input field', () => {
    render(<Form />);
    expect(queryPlayerInput()).toHaveLength(1);
    expect(queryPlayerInput()[0]).toHaveValue('');

    fireEvent.change(queryPlayerInput()[0], { target: { value: 'eric' } });
    expect(queryPlayerInput()[0]).toHaveValue('eric');
  });
  it('does not create more inputs than defined', () => {
    render(<Form />);
    for (let i = 0; i < gameConfig.maxPlayers; i++) {
      const inputs = queryPlayerInput();
      fireEvent.change(inputs[i], { target: { value: `player ${i}` } });
    }
    expect(queryPlayerInput()).toHaveLength(gameConfig.maxPlayers);
  });
  it('filters invalid players', () => {
    render(<Form />);
    fireEvent.change(queryPlayerInput()[0], { target: { value: 'a' } });
    fireEvent.change(queryPlayerInput()[1], { target: { value: 'b' } });
    expect(queryPlayerInput()).toHaveLength(3);

    fireEvent.change(queryPlayerInput()[1], { target: { value: '' } });
    fireEvent.change(queryPlayerInput()[0], { target: { value: 'aa' } });
    expect(queryPlayerInput()).toHaveLength(2);
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
    fireEvent.change(queryPlayerInput()[0], { target: { value: 'eric' } });
    fireEvent.click(submit);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
  });
});
