import {createMockState, createMockStore, render, screen} from '@/tests/utils';
import {MyMapsPage} from '../poc/my-maps.page';

beforeEach(() => {
  jest.clearAllMocks();
});

function getNameInput() {
  return screen.queryByLabelText(/map name/i);
}

describe('My maps page', () => {
  it(`renders`, () => {
    const state = createMockState();
    const store = createMockStore(state);
    render(<MyMapsPage />, store);
    expect(getNameInput()).toMatchSnapshot();
  });
});
