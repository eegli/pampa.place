import {config} from '@/config/game';
import {MapService} from '@/services/google';
import {
  ByRoleOptions,
  createMockState,
  createMockStore,
  fireEvent,
  render,
  screen,
  __actualInitialAppState,
} from '@/tests/utils';
import {FormMapSelect} from './fields/select-map';
import {FormRoundSelect} from './fields/select-round';
import {FormTimeLimitSelect} from './fields/select-time';
import {FormPlayers} from './fields/set-players';
import {Form} from './form';

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
  it('inits game on click', () => {
    const store = createMockStore();
    render(<Form />, store);
    const submit = screen.getByRole('button', {name: /start/i});
    fireEvent.click(submit);
    expect(store.getState().game.status).toMatchInlineSnapshot(
      `"PENDING_PLAYER"`
    );
  });
  it('resets game state and fields', () => {
    const state = createMockState({
      game: {
        players: ['player 1', 'player 2'],
        timeLimit: -100,
        rounds: {
          total: 200,
          current: 100,
          progress: 50,
        },
        mapId: 'hihihi',
      },
    });
    const store = createMockStore(state);
    render(<Form />, store);
    const reset = screen.getByRole('button', {name: /reset/i});
    fireEvent.click(reset);
    expect(store.getState()).toEqual(__actualInitialAppState);
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
    render(<FormTimeLimitSelect />);
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
  const toggleSpy = jest.spyOn(MapService, 'mount');
  it('displays maps', () => {
    render(<FormMapSelect />);
    screen.getByRole('button', {name: /test map/i});
  });
  it('displays map preview', () => {
    render(<FormMapSelect />);
    const previewMapButton = screen.getByTestId('map-preview-button');
    fireEvent.click(previewMapButton);
    expect(toggleSpy).toHaveBeenCalledTimes(1);
  });
});
