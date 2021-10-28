import { config } from '@/config/game';
import { STATUS } from '@/redux/slices/game';
import {
  ByRoleOptions,
  createMockStore,
  fireEvent,
  render,
  screen,
} from '@/tests/test-utils';
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

function getRadios(opts?: ByRoleOptions) {
  return screen.getAllByRole('radio', opts);
}

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
  it('truncates long inputs', () => {
    render(<FormPlayers />);
    fireEvent.change(queryPlayerInput()[0], {
      target: { value: 'eric eric eric eric eric eric eric eric eric eric ' },
    });
    expect(queryPlayerInput()[0]).toHaveValue('eric eric eric eric eric');
  });
});

describe('Form, round select', () => {
  const rounds = [1, 2, 3];

  it('renders round select options', () => {
    render(<FormRoundSelect rounds={rounds} />);
    expect(getRadios({ checked: true })).toHaveLength(1);
    expect(getRadios()).toHaveLength(rounds.length);
  });

  it('updates round select radio buttons', () => {
    render(<FormRoundSelect rounds={rounds} />);
    const roundInputs = getRadios();
    fireEvent.click(roundInputs[0]);
    expect(getRadios()[0]).toHaveProperty('checked', true);
    fireEvent.click(roundInputs[1]);
    expect(getRadios()[1]).toHaveProperty('checked', true);
  });
});

describe('Form, duration select', () => {
  const timeLimits = [10, 20, 30];
  it('renders duration select options', () => {
    const { container } = render(
      <FormTimeLimitSelect timeLimits={timeLimits} />
    );
    expect(container).toMatchSnapshot();

    expect(getRadios({ checked: true })).toHaveLength(1);
    expect(getRadios()).toHaveLength(timeLimits.length);
  });

  it('updates duration select radio buttons', () => {
    render(<FormTimeLimitSelect timeLimits={timeLimits} />);
    const durationInputs = getRadios();
    fireEvent.click(durationInputs[0]);
    expect(getRadios()[0]).toHaveProperty('checked', true);
    fireEvent.click(durationInputs[1]);
    expect(getRadios()[1]).toHaveProperty('checked', true);
  });
});

// TODO
describe('Form, map select', () => {
  function queryMapOps() {
    return screen.getAllByRole('button');
  }

  it('renders map options', () => {
    render(
      <FormMapSelect customMapIds={['Alpen']} countryMapIds={['Switzerland']} />
    );
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
