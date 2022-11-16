import * as ConfirmDialog from '@/components/feedback/dialog';
import * as PreviewDialog from '@/components/feedback/dialog-preview';
import {Constants} from '@/config/constants';
import {LocalStorageMaps} from '@/config/types';
import * as helpers from '@/maps/helpers/parser';
import {userInputFeatureCollection} from '@/tests/fixtures/map';
import {act, fireEvent, render, screen} from '@/tests/utils';
import {MAPS} from 'src/maps';
import {MyMapsPage} from 'src/pages/my-maps.page';

beforeEach(() => {
  jest.clearAllMocks();
});

beforeAll(() => {
  jest.useFakeTimers();
  expect(MAPS.size).toBe(1);
});

afterAll(() => {
  jest.useRealTimers();
  expect(MAPS.size).toBe(1);
});

const inputs = {
  addMap: () => screen.getByRole('button', {name: /add map/i}),
  json: () => screen.getByLabelText(/geojson/i),
  name: () => screen.getByLabelText(/map name/i),
};

const spies = {
  dialog: jest.fn(), // jest.spyOn(ConfirmDialog, 'Dialog'),
  preview: jest.fn(), //jest.spyOn(PreviewDialog, 'PreviewDialog'),
  parser: jest.fn(), //jest.spyOn(helpers, 'parseUserGeoJSON'),
  setMap: jest.fn(), //jest.spyOn(MAPS, 'set').mockImplementation(jest.fn()),
  deleteMap: jest.fn(), // jest.spyOn(MAPS, 'delete').mockImplementation(jest.fn()),
};

function enterName(value: string) {
  fireEvent.change(inputs.name(), {
    target: {value},
  });
}

function enterJSON(value: unknown) {
  if (typeof value !== 'string') {
    value = JSON.stringify(value);
  }
  fireEvent.change(inputs.json(), {
    target: {value},
  });
  // The JSON input is debounced
  act(() => {
    jest.runOnlyPendingTimers();
  });
}

function getLocalMaps(): LocalStorageMaps {
  return JSON.parse(
    window.localStorage.getItem(Constants.LOCALSTORAGE_MAPS_KEY) || '{}'
  );
}

function expectDialogToBeGone() {
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
}

describe('Integration, local map handling', () => {
  it.skip('map name input', () => {
    render(<MyMapsPage />);
    const input = inputs.json();
    expect(input).toHaveValue('');
    fireEvent.change(input, {
      target: {value: 'test'},
    });
    expect(input).toHaveValue('test');
  });
  it.skip('json input', () => {
    render(<MyMapsPage />);
    const input = inputs.json();
    enterJSON('asd');
    expect(input).toHaveValue('asd');
    // Make sure there is an error message
    expect(inputs.json()).toBeInvalid();
    enterJSON('{}');
    expect(input).toHaveValue('{}');
    expect(inputs.json()).not.toBeInvalid();
  });
  it.skip('parses user maps and adds them to global maps and local storage', () => {
    render(<MyMapsPage />);
    expect(
      screen.queryByRole('button', {name: /add map/gi})
    ).not.toBeInTheDocument();
    // Add invalid map
    enterName('this wont work');
    enterJSON('{}');
    fireEvent.click(inputs.addMap());
    expect(inputs.json()).toBeInvalid();
    // Add actual map
    enterName('my user map');
    enterJSON(userInputFeatureCollection);
    fireEvent.click(inputs.addMap());
    expect(inputs.json()).not.toBeInvalid();
    expect(spies.parser).toHaveBeenCalledWith(
      expect.any(String),
      'my user map',
      'local'
    );
    expect(spies.setMap).toHaveBeenCalledTimes(1);
    const localMaps = Object.values(getLocalMaps());
    expect(localMaps.length).toBe(1);
  });

  it.skip('allows previewing local maps', () => {
    const localMaps = Object.values(getLocalMaps());
    expect(localMaps.length).toBe(1);
    render(<MyMapsPage />);
    fireEvent.click(screen.getByRole('button', {name: 'preview-map-btn'}));
    expect(spies.preview).toHaveBeenCalledTimes(1);
    act(() => {
      spies.preview.mock.calls[0][0].onCloseCallback();
    });
    expectDialogToBeGone();
  });
  it.skip('allows editing local maps', () => {
    const localMaps = Object.values(getLocalMaps());
    expect(localMaps.length).toBe(1);
    render(<MyMapsPage />);
    expect(inputs.json()).toHaveValue('');
    fireEvent.click(screen.getByRole('button', {name: 'edit-map-icon'}));
    expect(inputs.json()).not.toHaveValue('');
  });
  it.skip('removes input maps from global maps and local storage', () => {
    const localMaps = Object.values(getLocalMaps());
    expect(localMaps.length).toBe(1);
    render(<MyMapsPage />);
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', {name: 'delete-map-icon'}));
    expect(spies.dialog).toHaveBeenCalledTimes(1);
    act(() => {
      spies.dialog.mock.calls[0][0].onCancelCallback();
    });
    // Canceling should clear the dialog
    expectDialogToBeGone();
    fireEvent.click(screen.getByRole('button', {name: 'delete-map-icon'}));
    // Delete the map from local storage and the global maps
    act(() => {
      spies.dialog.mock.calls[0][0].onConfirmCallback();
    });
    expectDialogToBeGone();
    expect(spies.deleteMap).toHaveBeenCalledTimes(1);
    const updatedLocalMaps = window.localStorage.getItem(
      Constants.LOCALSTORAGE_MAPS_KEY
    );
    expect(JSON.parse(updatedLocalMaps || '[]')).toStrictEqual({});
  });
});
