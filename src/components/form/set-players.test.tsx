import {config} from '@/config/game';
import {fireEvent, render, screen} from '@/tests/utils';
import {FormPlayers} from './set-players';

function queryPlayerInput() {
  return screen.getAllByLabelText(/^player \d$/i);
}

describe('Form, player name input', () => {
  it('always renders at least one player input field', () => {
    render(<FormPlayers />);
    expect(queryPlayerInput()).toHaveLength(1);
    expect(queryPlayerInput()[0]).toHaveValue('');
  });
  it('does not create more inputs than configured', () => {
    render(<FormPlayers />);

    for (let i = 0; i <= config.maxPlayers; i++) {
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
