import * as ConfirmDialog from '@/components/feedback/dialog';
import * as PreviewDialog from '@/components/feedback/dialog-preview';
import {Constants} from '@/config/constants';
import * as helpers from '@/config/helpers/validator';
import {MAPS} from '@/config/maps';
import {LocalStorageMaps, MapData} from '@/config/types';
import {testMap, userInputFeatureCollection} from '@/tests/fixtures/map';
import {act, fireEvent, render, screen} from '@/tests/utils';
import {MyMapsPage} from 'src/pages/my-maps.page';

jest.useFakeTimers();

beforeEach(() => {
  jest.clearAllMocks();
  window.localStorage.clear();
});

beforeAll(() => {
  expect(MAPS.size).toBe(1);
});

afterAll(() => {
  expect(MAPS.size).toBe(1);
});

const confirmationSpy = jest.spyOn(ConfirmDialog, 'Dialog');
const previewSpy = jest.spyOn(PreviewDialog, 'PreviewDialog');
const setMapsSpy = jest.spyOn(MAPS, 'set').mockImplementation(jest.fn());
const deleteMapSpy = jest.spyOn(MAPS, 'delete').mockImplementation(jest.fn());
const generateMapSpy = jest.spyOn(helpers, 'validateAndComputeGeoJSON');

const userInputMap1 = JSON.stringify(userInputFeatureCollection);
const userInputMap2 = JSON.stringify(userInputFeatureCollection.features[0]);

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

function loadMapIntoLocalstorage() {
  const userMap: MapData = JSON.parse(JSON.stringify(testMap));
  const local: LocalStorageMaps = {[userMap.properties.id]: userMap};
  window.localStorage.setItem(
    Constants.LOCALSTORAGE_MAPS_KEY,
    JSON.stringify(local)
  );
}

function expectDialogToBeGone() {
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
}

describe('Integration, local map handling', () => {
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
    expect(jsonInput()).toBeInvalid();
    enterJSON('{}');
    expect(input).toHaveValue('{}');
    expect(jsonInput()).not.toBeInvalid();
  });
  it('adds input maps to global maps and local storage', () => {
    render(<MyMapsPage />);
    expect(screen.queryByRole('button', {name: /add map/gi})).toBeNull();
    // Add invalid map
    enterName('this wont work');
    enterJSON('{}');
    fireEvent.click(mapButton());
    expect(jsonInput()).toBeInvalid();
    // Add map 1 (a feature collection)
    enterName('collection map');
    enterJSON(userInputMap1);
    fireEvent.click(mapButton());
    expect(jsonInput()).not.toBeInvalid();
    expect(generateMapSpy).toHaveBeenCalledTimes(1);
    expect(generateMapSpy.mock.calls[0][1]).toEqual('local');
    // Add map 2 (a feature)
    enterName('feature map');
    enterJSON(userInputMap2);
    fireEvent.click(mapButton());
    expect(generateMapSpy).toHaveBeenCalledTimes(2);
    expect(setMapsSpy).toHaveBeenCalledTimes(2);
    const local: LocalStorageMaps = JSON.parse(
      window.localStorage.getItem(Constants.LOCALSTORAGE_MAPS_KEY) || '{}'
    );
    const localMaps = Object.values(local);
    expect(localMaps.length).toBe(2);
  });
  it('removes input maps from global maps and local storage', () => {
    loadMapIntoLocalstorage();
    render(<MyMapsPage />);
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
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
    expect(deleteMapSpy).toHaveBeenCalledTimes(1);
    const updatedLocalMaps = window.localStorage.getItem(
      Constants.LOCALSTORAGE_MAPS_KEY
    );
    expect(JSON.parse(updatedLocalMaps || '[]')).toStrictEqual({});
  });
  it('allows previewing local maps', () => {
    loadMapIntoLocalstorage();
    render(<MyMapsPage />);
    fireEvent.click(screen.getByRole('button', {name: 'preview-map-btn'}));
    expect(previewSpy).toHaveBeenCalledTimes(1);
    expect(previewSpy.mock.calls[0][0]).toMatchSnapshot('map preview dialog');
    act(() => {
      previewSpy.mock.calls[0][0].onCloseCallback();
    });
    expectDialogToBeGone();
  });
  it('allows editing local maps', () => {
    loadMapIntoLocalstorage();
    render(<MyMapsPage />);
    expect(jsonInput()).toHaveValue('');
    fireEvent.click(screen.getByRole('button', {name: 'edit-map-icon'}));
    expect(jsonInput()).not.toHaveValue('');
  });
});