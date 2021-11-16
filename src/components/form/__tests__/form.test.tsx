import {config} from '@/config/game';
import {STATUS} from '@/redux/game/game.slice';
import {
  ByRoleOptions,
  createMockStore,
  fireEvent,
  render,
  screen,
} from '@/tests/test-utils';
import React from 'react';
import {Gmap} from '../../../services/google-map';
import Form from '../form';
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
    return screen.getByRole('button', {name: /start/i});
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

    expect(store.getState().game.status).not.toEqual(STATUS.UNINITIALIZED);
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
  it('does not create more inputs than configured', () => {
    render(<FormPlayers />);

    for (let i = 0; i < config.maxPlayers + 2; i++) {
      const inputs = queryPlayerInput();
      if (inputs[i]) {
        fireEvent.change(inputs[i], {target: {value: `player ${i}`}});
      } else {
        break;
      }
    }
    expect(queryPlayerInput()).toHaveLength(config.maxPlayers);
  });
  it('truncates long and filters invalid player names', () => {
    render(<FormPlayers />);
    fireEvent.change(queryPlayerInput()[0], {
      target: {value: `eric eric eric eric eric eric eric eric eric eric`},
    });
    expect(queryPlayerInput()[0]).toHaveValue('eric eric eric eric eric');
    fireEvent.change(queryPlayerInput()[1], {
      target: {value: 'player 2'},
    });
    fireEvent.change(queryPlayerInput()[0], {
      target: {value: ''},
    });
    expect(queryPlayerInput()[0]).toHaveValue('player 2');
  });
});

describe('Form, round select', () => {
  it('renders round select options', () => {
    render(<FormRoundSelect />);
    expect(getRadios({checked: true})).toHaveLength(1);
    expect(getRadios()).toHaveLength(config.rounds.length);
  });

  it('updates round select radio buttons', () => {
    render(<FormRoundSelect />);
    const roundInputs = getRadios();
    fireEvent.click(roundInputs[0]);
    expect(getRadios()[0]).toHaveProperty('checked', true);
    fireEvent.click(roundInputs[1]);
    expect(getRadios()[1]).toHaveProperty('checked', true);
  });
});

describe('Form, duration select', () => {
  it('renders duration select options', () => {
    const {container} = render(<FormTimeLimitSelect />);
    expect(container).toMatchSnapshot();

    expect(getRadios({checked: true})).toHaveLength(1);
    expect(getRadios()).toHaveLength(config.timeLimits.length);
  });

  it('updates duration select radio buttons', () => {
    render(<FormTimeLimitSelect />);
    const durationInputs = getRadios();
    fireEvent.click(durationInputs[0]);
    expect(getRadios()[0]).toHaveProperty('checked', true);
    fireEvent.click(durationInputs[1]);
    expect(getRadios()[1]).toHaveProperty('checked', true);
  });
});

// TODO
describe('Form, map selection and preview', () => {
  const toggleSpy = jest.spyOn(Gmap, 'toggle');

  it('displays maps', () => {
    render(<FormMapSelect />);
    const mapSelection = screen.getByRole('button', {name: /custom map/i});
    expect(mapSelection).toBeInTheDocument();
  });
  it('displays map preview', () => {
    render(<FormMapSelect />);
    const previewMapButton = screen.getByTestId('map-preview-button');
    fireEvent.click(previewMapButton);
    expect(toggleSpy).toHaveBeenCalledTimes(1);
  });
});
