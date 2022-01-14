import {MAPS} from '@/config/maps';
import {testFeatureCollecton, testMap} from '@/config/__fixtures__';
import {
  act,
  createMockState,
  createMockStore,
  fireEvent,
  render,
  screen,
} from '@/tests/utils';
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
    const nameInput = screen.getByLabelText(/map name/gi);
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveValue('');
    fireEvent.change(nameInput, {
      target: {value: 'test'},
    });
    expect(nameInput).toHaveValue('test');
  });
  it('json input', async () => {
    render(<MyMapsPage />);
    const jsonInput = screen.getByLabelText(/geojson/gi);
    expect(jsonInput).toBeInTheDocument();
    fireEvent.change(jsonInput, {
      target: {value: 'asd'},
    });
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(jsonInput).toHaveValue('asd');
    // Make sure there is an error message
    screen.getByText(/Error parsing GeoJSON/gi);
    fireEvent.change(jsonInput, {
      target: {value: '{}'},
    });
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(jsonInput).toHaveValue('{}');
    expect(screen.queryByText(/Error parsing GeoJSON/gi)).toBeNull();
  });
  it('adds maps in the form of featurecollections', async () => {
    render(<MyMapsPage />);
    expect(MAPS.get('local-new-map')).toBeUndefined();
    expect(screen.queryByRole('button', {name: /add map/gi})).toBeNull();
    fireEvent.change(screen.getByLabelText(/map name/i), {
      target: {value: 'new map'},
    });
    fireEvent.change(screen.getByLabelText(/geojson/i), {
      target: {value: JSON.stringify(testFeatureCollecton)},
    });
    act(() => {
      jest.runOnlyPendingTimers();
    });
    const addButton = screen.getByRole('button', {name: /add map/gi});
    fireEvent.click(addButton);
    expect(MAPS.get('local-new-map')).toBeTruthy();
    MAPS.delete('local-new-map');
  });
  it('adds maps in the form of features', async () => {
    render(<MyMapsPage />);
    expect(MAPS.get('local-new-map')).toBeUndefined();
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
    const addButton = screen.getByRole('button', {name: /add map/gi});
    fireEvent.click(addButton);
    expect(MAPS.get('local-new-map')).toBeTruthy();
    MAPS.delete('local-new-map');
  });
});
