import {render} from '@/tests/utils';
import {PreviewPage} from 'src/pages/preview.page';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Integration, preview maps', () => {
  it('can preview maps', () => {
    render(<PreviewPage />);
    // WIP
  });
});
