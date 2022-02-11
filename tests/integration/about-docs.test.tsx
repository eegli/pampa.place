import {render, screen} from '@/tests/utils';
import AboutPage from 'src/pages/about.page';

describe('Integration, about and docs page', () => {
  it('matches snapshot', () => {
    render(<AboutPage />);
    expect(screen.getByRole('main')).toMatchSnapshot();
  });
});
