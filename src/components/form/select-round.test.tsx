import {config} from '@/config/game';
import {ByRoleOptions, fireEvent, render, screen} from '@/tests/utils';
import {FormRoundSelect} from './select-round';

function getRadios(opts?: ByRoleOptions) {
  return screen.getAllByRole('radio', opts);
}

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
