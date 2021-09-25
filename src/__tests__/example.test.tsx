import { render } from '@testing-library/react';
import { min } from '@utils';
import Error from '../components/error';

describe('it tests', () => {
  it('works', () => {
    expect(min(2, 3)).toEqual(2);
  });

  it('renders', () => {
    const { container } = render(<Error />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
