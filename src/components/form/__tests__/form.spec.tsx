import gameConfig from '@config/game';
import { createMockStore, fireEvent, render, screen } from '@tests/test-utils';
import React from 'react';
import Form from '../form';
import FormPlayers from '../form.players';

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
  it('matches snapshot', () => {
    const { container } = render(<Form />);
    expect(container.firstChild).toMatchSnapshot();
  });

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

    expect(store.getState().game.meta.initialized).toBeTruthy();
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
    for (let i = 0; i < gameConfig.maxPlayers; i++) {
      const inputs = queryPlayerInput();
      fireEvent.change(inputs[i], { target: { value: `player ${i}` } });
    }
    expect(queryPlayerInput()).toHaveLength(gameConfig.maxPlayers);
  });
});

describe('Form, round select', () => {
  function queryRoundSelect() {
    return screen.getAllByRole('button', { name: /round/i });
  }

  it('renders a round select options', () => {
    render(<Form />);
    expect(queryRoundSelect()).toHaveLength(3);
    expect(queryRoundSelect()[0]).toHaveValue('');
  });
});