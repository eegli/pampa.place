import {config} from '@/config/game';
import {ByRoleOptions, fireEvent, render, screen} from '@/tests/utils';
import {FormTimeLimitSelect} from './select-time';

function getRadios(opts?: ByRoleOptions) {
  return screen.getAllByRole('radio', opts);
}

describe('Form, duration select', () => {
  it('renders duration select options', () => {
    render(<FormTimeLimitSelect />);
    const checkedItem = getRadios({checked: true});
    expect(checkedItem).toHaveLength(1);
    expect(getRadios()).toHaveLength(config.timeLimits.length);
  });

  it('updates duration select radio buttons', () => {
    render(<FormTimeLimitSelect />);
    const durationInputs = getRadios();
    fireEvent.click(durationInputs[0]);
    expect(getRadios()[0]).toBeChecked();
    fireEvent.click(durationInputs[1]);
    expect(getRadios()[1]).toBeChecked();
  });
});
