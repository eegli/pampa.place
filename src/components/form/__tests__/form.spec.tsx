import { config } from '@/config/game';
import { STATUS } from '@/redux/slices/game';
import { createMockStore, fireEvent, render, screen } from '@/tests/test-utils';
import React from 'react';
import Form from '../form';
import FormPlayers from '../form.players';
import FormRoundSelect from '../form.round-select';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
}));

describe('Form', () => {
  function querySubmitButton() {
    return screen.getByRole('button', { name: /start/i });
  }

  it('has submit button', () => {
    render(<Form />);
    const submit = querySubmitButton();
    expect(submit).toBeInTheDocument();
  });

  it('inits game on click', () => {
    const store = createMockStore();
    render(<Form />, store);
    const submit = querySubmitButton();
    fireEvent.click(submit);

    expect(store.getState().game.status).not.toEqual(STATUS.PENDING_START);
  });
});

describe('Form, player name input', () => {
  function queryPlayerInput() {
    return screen.queryAllByLabelText(/^player/i);
  }

  it('always renders at least one player input field', () => {
    render(<FormPlayers />);
    expect(queryPlayerInput()).toHaveLength(1);
    expect(queryPlayerInput()[0]).toHaveValue('');

    fireEvent.change(queryPlayerInput()[0], { target: { value: 'eric' } });
    expect(queryPlayerInput()[0]).toHaveValue('eric');
  });
  it('does not create more inputs than defined', () => {
    render(<FormPlayers />);
    for (let i = 0; i < config.maxPlayers; i++) {
      const inputs = queryPlayerInput();
      fireEvent.change(inputs[i], { target: { value: `player ${i}` } });
    }
    expect(queryPlayerInput()).toHaveLength(config.maxPlayers);
  });
  it('stores the player name in Redux', () => {
    const store = createMockStore();
    render(<FormPlayers />, store);
    const inputs = queryPlayerInput();
    fireEvent.change(inputs[0], { target: { value: 'eric' } });
    expect(store.getState().game.players.names).toEqual(['eric']);
  });
});

describe('Form, round select', () => {
  function queryRoundOptions() {
    return screen.getAllByRole('radio');
  }

  function getActiveRadioValue() {
    return screen.getByRole('radio', { checked: true });
  }

  it('renders round select options', () => {
    render(<FormRoundSelect />);

    expect(queryRoundOptions()).toHaveLength(config.rounds.length);
  });

  it('stores the selected round in Redux', () => {
    render(<FormRoundSelect />);
    const roundOptions = queryRoundOptions();
    fireEvent.click(roundOptions[0]);
    expect(getActiveRadioValue()).toMatchSnapshot();
    fireEvent.click(roundOptions[1]);
    expect(getActiveRadioValue()).toMatchSnapshot();
  });
});
