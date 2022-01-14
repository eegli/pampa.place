import {
  act,
  createMockState,
  createMockStore,
  fireEvent,
  render,
  screen,
} from '@/tests/utils';
import {testMap} from '../../config/__fixtures__';
import {MyMapsPage} from '../poc/my-maps.page';

jest.useFakeTimers();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('My maps page', () => {
  it('map name input', () => {
    const state = createMockState();
    const store = createMockStore(state);
    render(<MyMapsPage />, store);
    expect(screen.getByLabelText(/map name/i)).toMatchSnapshot();
    fireEvent.change(screen.getByLabelText(/map name/i), {
      target: {value: 'test'},
    });
    expect(screen.getByLabelText(/map name/i)).toHaveValue('test');
  });
  it('json input', async () => {
    render(<MyMapsPage />);
    fireEvent.change(screen.getByLabelText(/geojson/i), {
      target: {value: 'asd'},
    });
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(screen.getByLabelText(/geojson/i)).toHaveValue('asd');
    expect(screen.queryByText(/Error parsing GeoJSON/gi)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/geojson/i), {
      target: {value: '{}'},
    });
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(screen.getByLabelText(/geojson/i)).toHaveValue('{}');
    expect(screen.queryByText(/Error parsing GeoJSON/gi)).toBeNull();
  });
  it('submit', async () => {
    render(<MyMapsPage />);
    expect(screen.queryByRole('button', {name: /add map/gi})).toBeNull();
    fireEvent.change(screen.getByLabelText(/map name/i), {
      target: {value: 'new map'},
    });
    fireEvent.change(screen.getByLabelText(/geojson/i), {
      target: {value: JSON.stringify(testMap)},
    });
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(
      screen.queryByRole('button', {name: /add map/gi})
    ).toBeInTheDocument();
  });
});
