import * as PreviewDialog from '@/components/feedback/dialog-preview';
import {config} from '@/config/game';
import {testMap} from '@/config/__fixtures__';
import {
  act,
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

function getRadios(opts?: ByRoleOptions) {
  return screen.getAllByRole('radio', opts);
}

function queryPlayerInput() {
  return screen.getAllByLabelText(/^player/i);
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

describe('Form, map selection with category subheaders', () => {
  const previewSpy = jest.spyOn(PreviewDialog, 'PreviewDialog');
  it('displays maps and categories', async () => {
    render(<FormMapSelect />);
    const mapPreviewButtons = screen.getAllByRole('button', {
      name: testMap.properties.name,
    });
    expect(mapPreviewButtons).toHaveLength(1);
    fireEvent.mouseDown(mapPreviewButtons[0]);
    const fields = screen.getAllByRole('option');
    expect(fields).toHaveLength(2);
    // The category is capitalized in the dropdown
    expect(fields[0]).toHaveTextContent(
      new RegExp(testMap.properties.category, 'i')
    );
    expect(fields[1]).toHaveTextContent(testMap.properties.name);
  });
  it('displays map preview', () => {
    render(<FormMapSelect />);
    const previewMapButton = screen.getByRole('button', {
      name: 'preview-map-icon',
    });
    fireEvent.click(previewMapButton);
    expect(previewSpy).toHaveBeenCalledTimes(1);
    expect(previewSpy.mock.calls[0][0]).toMatchSnapshot('map preview');
    act(() => {
      previewSpy.mock.calls[0][0].onCloseCallback();
    });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
