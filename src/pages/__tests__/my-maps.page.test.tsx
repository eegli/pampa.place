import {MAPS} from '@/config/maps';
import {testFeatureCollecton, testMap} from '@/config/__fixtures__';
import {act, fireEvent, render, screen, within} from '@/tests/utils';
import * as ConfirmDialog from '../../components/feedback/dialog-confirm';
import * as PreviewDialog from '../../components/feedback/dialog-preview';
import {Constants} from '../../config/constants';
import {LocalStorageMaps, MapData} from '../../config/types';
import {MyMapsPage} from '../poc/my-maps.page';

jest.useFakeTimers();

const confirmationSpy = jest.spyOn(ConfirmDialog, 'ConfirmationDialog');
const previewSpy = jest.spyOn(PreviewDialog, 'PreviewDialog');

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

function expectDialogToBeGone() {
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
}

function loadLocalMaps() {
  const userMap: MapData = JSON.parse(JSON.stringify(testMap));
  userMap.properties.name = 'user input map';
  userMap.properties.id = 'local-user-input-map';
  const originalAmountOfMaps = MAPS.size;
  MAPS.set(userMap.properties.id, userMap);
  const local: LocalStorageMaps = {[userMap.properties.id]: userMap};
  window.localStorage.setItem(
    Constants.LOCALSTORAGE_MAPS_KEY,
    JSON.stringify(local)
  );

  return {
    userMapId: userMap.properties.id,
    cleanup() {
      MAPS.delete(userMap.properties.id);
      window.localStorage.clear();
      expect(MAPS.size).toBe(originalAmountOfMaps);
    },
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
    const originalAmountOfMaps = MAPS.size;
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
    // Manual cleanup
    MAPS.delete('local-collection-map');
    MAPS.delete('local-feature-map');
    expect(MAPS.size).toBe(originalAmountOfMaps);
    window.localStorage.clear();
  });
  it('removes input maps from global maps and local storage', () => {
    const {cleanup, userMapId} = loadLocalMaps();
    render(<MyMapsPage />);
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    // Delete, preview and edit buttons
    const mapItem = screen.getByRole('listitem');
    expect(within(mapItem).getAllByRole('button')).toHaveLength(3);
    fireEvent.click(screen.getByRole('button', {name: 'delete-map-icon'}));
    expect(confirmationSpy).toHaveBeenCalledTimes(1);
    expect(confirmationSpy.mock.calls[0][0]).toMatchSnapshot(
      'map deletion dialog'
    );
    act(() => {
      confirmationSpy.mock.calls[0][0].onCancelCallback();
    });
    // Canceling should clear the dialog
    expectDialogToBeGone();
    fireEvent.click(screen.getByRole('button', {name: 'delete-map-icon'}));
    // Delete the map from local storage and the global maps
    act(() => {
      confirmationSpy.mock.calls[0][0].onConfirmCallback();
    });
    expectDialogToBeGone();
    expect(MAPS.get(userMapId)).toBeUndefined();
    expect(MAPS.size).toBe(1);
    const updatedLocalMaps = window.localStorage.getItem(
      Constants.LOCALSTORAGE_MAPS_KEY
    );
    expect(JSON.parse(updatedLocalMaps || '[]')).toStrictEqual({});
    cleanup();
  });
  it('allows previewing local maps', () => {
    const {cleanup} = loadLocalMaps();
    render(<MyMapsPage />);
    fireEvent.click(screen.getByRole('button', {name: 'preview-map-btn'}));
    expect(previewSpy).toHaveBeenCalledTimes(1);
    expect(previewSpy.mock.calls[0][0]).toMatchSnapshot('local map preview');
    act(() => {
      previewSpy.mock.calls[0][0].onCloseCallback();
    });
    expectDialogToBeGone();
    cleanup();
  });
  it('allows editing local maps', () => {
    const {cleanup} = loadLocalMaps();
    render(<MyMapsPage />);
    expect(jsonInput()).toHaveValue('');
    fireEvent.click(screen.getByRole('button', {name: 'edit-map-icon'}));
    expect(jsonInput()).not.toHaveValue('');
    cleanup();
  });
});
