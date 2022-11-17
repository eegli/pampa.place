import {userInputFeatureCollection} from '@/tests/fixtures/map';
import {act, fireEvent, render, screen, within} from '@/tests/utils';
import {MyMapsPage} from 'src/pages/my-maps.page';

beforeEach(() => {
  jest.clearAllMocks();
});

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

const inputs = {
  addMap: () => screen.getByRole('button', {name: /add map/i}),
  json: () => screen.getByLabelText(/geojson/i),
  name: () => screen.getByLabelText(/map name/i),
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

function expectDialogToBeGone() {
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
}

describe('Integration, local map handling', () => {
  it('map name input', () => {
    render(<MyMapsPage />);
    const input = inputs.json();
    expect(input).toHaveValue('');
    fireEvent.change(input, {
      target: {value: 'test'},
    });
    expect(input).toHaveValue('test');
  });
  it('json input', () => {
    render(<MyMapsPage />);
    const input = inputs.json();
    enterJSON('not valid json');
    expect(input).toHaveValue('not valid json');
    // Make sure there is an error message
    expect(inputs.json()).toBeInvalid();
    enterJSON('{}');
    expect(input).toHaveValue('{}');
    expect(inputs.json()).not.toBeInvalid();
  });
  it('parses user maps and adds them to global maps and local storage', () => {
    render(<MyMapsPage />);
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
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
    expect(screen.queryAllByRole('listitem')).toHaveLength(1);
  });

  // At this point, we already have a local map from the previous test
  it('allows previewing local maps', () => {
    render(<MyMapsPage />);
    fireEvent.click(screen.getByRole('button', {name: 'preview-map-btn'}));
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText(/rough bounds/i)).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole('button', {name: /close/i}));
    expectDialogToBeGone();
  });

  it('allows editing local maps', () => {
    render(<MyMapsPage />);
    expect(inputs.json()).toHaveValue('');
    fireEvent.click(screen.getByRole('button', {name: 'edit-map-icon'}));
    expect(inputs.json()).not.toHaveValue('');
    expect(inputs.name()).toHaveValue('my user map');
  });

  it('removes input maps from global maps and local storage', () => {
    render(<MyMapsPage />);
    expect(screen.queryAllByRole('listitem')).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', {name: 'delete-map-icon'}));
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(
      within(dialog).getByText(
        /are you sure you want to delete your local map "my user map"?/i
      )
    ).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole('button', {name: /delete map/i}));
    expectDialogToBeGone();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
