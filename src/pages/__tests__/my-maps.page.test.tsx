import {MAPS} from '@/config/maps';
import {testFeatureCollecton, testMap} from '@/config/__fixtures__';
import {act, fireEvent, render, screen} from '@/tests/utils';
import {Constants} from '../../config/constants';
import {LocalStorageMaps} from '../../config/types';
import {MyMapsPage} from '../poc/my-maps.page';

jest.useFakeTimers();

beforeEach(() => {
  jest.clearAllMocks();
});

const mapButton = () => screen.getByRole('button', {name: /add map/gi});
const jsonInput = () => screen.getByLabelText(/geojson/i);
const nameInput = () => screen.getByLabelText(/map name/gi);

function enterName(value: string) {
  fireEvent.change(nameInput(), {
    target: {value},
  });
}

function enterJSON(value: string) {
  fireEvent.change(jsonInput(), {
    target: {value},
  });
  // The JSON input is debounced
  act(() => {
    jest.runOnlyPendingTimers();
  });
}

describe('My maps page', () => {
  it('map name input', () => {
    render(<MyMapsPage />);
    const input = nameInput();
    expect(input).toHaveValue('');
    fireEvent.change(input, {
      target: {value: 'test'},
    });
    expect(input).toHaveValue('test');
  });
  it('json input', () => {
    render(<MyMapsPage />);
    const input = jsonInput();
    enterJSON('asd');
    expect(input).toHaveValue('asd');
    // Make sure there is an error message
    screen.getByText(/Error parsing GeoJSON/gi);
    enterJSON('{}');
    expect(input).toHaveValue('{}');
    expect(screen.queryByText(/Error parsing GeoJSON/gi)).toBeNull();
  });
  it('adds input to global maps and local storage', () => {
    render(<MyMapsPage />);
    expect(MAPS.size).toBe(1);
    expect(screen.queryByRole('button', {name: /add map/gi})).toBeNull();
    // Add map 1 (a feature collection)
    enterName('collection map');
    enterJSON(JSON.stringify(testFeatureCollecton));
    fireEvent.click(mapButton());
    // Add map 2 (a feature)
    enterName('feature map');
    enterJSON(JSON.stringify(testMap));
    fireEvent.click(mapButton());
    expect(MAPS.get('local-collection-map')).toBeTruthy();
    expect(MAPS.get('local-feature-map')).toBeTruthy();
    const local: LocalStorageMaps = JSON.parse(
      window.localStorage.getItem(Constants.LOCALSTORAGE_MAPS_KEY) || '{}'
    );
    const localMaps = Object.values(local);
    expect(localMaps.length).toBe(2);
    MAPS.delete('local-collection-map');
    MAPS.delete('local-feature-map');
    expect(MAPS.size).toBe(1);
  });
});
