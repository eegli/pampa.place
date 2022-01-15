import {MAPS} from '@/config/maps';
import {testFeatureCollecton, testMap} from '@/config/__fixtures__';
import {act, fireEvent, render, screen, waitFor, within} from '@/tests/utils';
import * as Dialog from '../../components/feedback/dialog-confirm';
import {Constants} from '../../config/constants';
import {LocalStorageMaps, MapData} from '../../config/types';
import {MyMapsPage} from '../poc/my-maps.page';

jest.useFakeTimers();

const dialogSpy = jest.spyOn(Dialog, 'ConfirmationDialog');

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

function loadLocalMaps() {
  // Prepare localstorage before rendering
  const userMap: MapData = {...testMap};
  // Overwrite the mock map to have the properties of a user map
  userMap.properties.name = 'user map';
  userMap.properties.id = 'local-user-map';
  expect(MAPS.size).toBe(1);
  MAPS.set(userMap.properties.id, userMap);
  expect(MAPS.size).toBe(2);
  const local: LocalStorageMaps = {[userMap.properties.id]: userMap};
  window.localStorage.setItem(
    Constants.LOCALSTORAGE_MAPS_KEY,
    JSON.stringify(local)
  );

  return function cleanup() {
    MAPS.delete('local-user-map');
    window.localStorage.clear();
  };
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
  it('adds input maps to global maps and local storage', () => {
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
    window.localStorage.clear();
  });
  it('removes input maps from global maps and local storage', async () => {
    const cleanup = loadLocalMaps();
    render(<MyMapsPage />);
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    // Delete, preview and edit buttons
    const mapItem = screen.getByRole('listitem');
    expect(within(mapItem).getAllByRole('button')).toHaveLength(3);
    fireEvent.click(screen.getByRole('button', {name: 'delete-map-icon'}));
    expect(dialogSpy).toHaveBeenCalledTimes(3);
    const confirmationDialog = screen.getByRole('dialog');
    expect(confirmationDialog).toMatchSnapshot();
    expect(confirmationDialog).toHaveTextContent(
      'Are you sure you want to delete your local map "user map"'
    );
    fireEvent.click(screen.getByRole('button', {name: /cancel/i}));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });
    fireEvent.click(screen.getByRole('button', {name: 'delete-map-icon'}));

    fireEvent.click(screen.getByRole('button', {name: /delete map/gi}));
    expect(MAPS.get(testMap.properties.id)).toBeUndefined();
    expect(MAPS.size).toBe(1);
    const updatedLocalMaps = window.localStorage.getItem(
      Constants.LOCALSTORAGE_MAPS_KEY
    );
    expect(JSON.parse(updatedLocalMaps || '[]')).toStrictEqual({});
    cleanup();
  });
  it('allows editing local maps', () => {
    const cleanup = loadLocalMaps();
    render(<MyMapsPage />);
    expect(jsonInput()).toHaveValue('');
    fireEvent.click(screen.getByRole('button', {name: 'edit-map-icon'}));
    expect(jsonInput()).not.toHaveValue('');
    cleanup();
  });
  it('allows previewing local maps', () => {
    const cleanup = loadLocalMaps();
    const {container} = render(<MyMapsPage />);
    fireEvent.click(screen.getByRole('button', {name: 'preview-map-btn'}));
    // const previewDialog = screen.getAllByRole('dialog');
    expect(container.firstChild).toMatchSnapshot();
  });
});
