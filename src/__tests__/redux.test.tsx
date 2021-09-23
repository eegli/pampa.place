import { max } from '@utils';
import Form from '../components/form/form';
import { render } from './test-utils';

describe('it tests', () => {
  it('works', () => {
    expect(max(2, 3)).toEqual(3);
  });

  it('renders', () => {
    const { container } = render(<Form />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
