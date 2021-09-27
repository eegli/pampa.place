import { config } from '@/config/game';
import { STATUS } from '@/redux/slices/game';
import { createMockStore, fireEvent, render, screen } from '@/tests/test-utils';
import React from 'react';
import Form from '../form';
import MapPreview from '../form.map-preview';
import FormMapSelect from '../form.map-select';
import FormPlayers from '../form.players';
import FormRoundSelect from '../form.round-select';
import FormTimeLimitSelect from '../form.time-select';

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
  });
  it('does not create more inputs than defined', () => {
    render(<FormPlayers />);
    for (let i = 0; i < config.maxPlayers; i++) {
      const inputs = queryPlayerInput();
      fireEvent.change(inputs[i], { target: { value: `player ${i}` } });
    }
    expect(queryPlayerInput()).toHaveLength(config.maxPlayers);
  });
  it('displays player names and filters empty inputs', () => {
    render(<FormPlayers />);
    fireEvent.change(queryPlayerInput()[0], { target: { value: 'eric' } });
    expect(queryPlayerInput()[0]).toHaveValue('eric');
    fireEvent.change(queryPlayerInput()[1], { target: { value: 'eric 2' } });
    expect(queryPlayerInput()[1]).toHaveValue('eric 2');
    fireEvent.change(queryPlayerInput()[0], { target: { value: '' } });
    expect(queryPlayerInput()[0]).toHaveValue('eric 2');
  });
});

describe('Form, round select', () => {
  function queryRoundOpts() {
    return screen.getAllByRole('radio');
  }

  it('renders round select options', () => {
    render(<FormRoundSelect />);
    expect(screen.getAllByRole('radio', { checked: true })).toHaveLength(1);
    expect(queryRoundOpts()).toHaveLength(config.rounds.length);
  });

  it('updates round select radio buttons', () => {
    render(<FormRoundSelect />);
    const roundInputs = queryRoundOpts();
    fireEvent.click(roundInputs[0]);
    expect(queryRoundOpts()[0]).toHaveProperty('checked', true);
    fireEvent.click(roundInputs[1]);
    expect(queryRoundOpts()[1]).toHaveProperty('checked', true);
  });
});

describe('Form, duration select', () => {
  function queryDurationOpts() {
    return screen.getAllByRole('radio');
  }

  it('renders duration select options', () => {
    render(<FormTimeLimitSelect />);
    expect(screen.getAllByRole('radio', { checked: true })).toHaveLength(1);
    expect(queryDurationOpts()).toHaveLength(config.timeLimits.length);
  });

  it('updates duration select radio buttons', () => {
    render(<FormTimeLimitSelect />);
    const durationInputs = queryDurationOpts();
    fireEvent.click(durationInputs[0]);
    expect(queryDurationOpts()[0]).toHaveProperty('checked', true);
    fireEvent.click(durationInputs[1]);
    expect(queryDurationOpts()[1]).toHaveProperty('checked', true);
  });
});
// TODO
describe('Form, map select', () => {
  function queryMapOps() {
    return screen.getAllByRole('button');
  }

  it('renders map options', () => {
    render(<FormMapSelect />);
    expect(queryMapOps()).toMatchSnapshot();
  });
});
// TODO
describe('Form, map preview', () => {
  it('renders map options', () => {
    const { container: c1 } = render(
      <MapPreview title="test map" open={true} setIsOpen={() => {}} />
    );
    expect(c1).toMatchSnapshot();
    const { container: c2 } = render(
      <MapPreview title="test map" open={false} setIsOpen={() => {}} />
    );
    expect(c2).toMatchSnapshot();
  });
});
