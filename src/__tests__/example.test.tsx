import { render } from '@testing-library/react';
import { max } from '@utils';
import Error from '../components/error';

describe('it tests', () => {
  it('works', () => {
    expect(max(2, 3)).toEqual(3);
  });

  it('renders', () => {
    const { container } = render(<Error />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
