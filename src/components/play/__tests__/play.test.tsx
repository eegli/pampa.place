import {updateSelectedPosition} from '@/redux/position';
import {
  createMockState,
  createMockStore,
  render,
  screen,
} from '@/tests/test-utils';
import React from 'react';
import {mocked} from 'ts-jest/utils';
import {MapService} from '../../../services/google';
import {Play} from '../play';

/* WORK IN PROGRESS */

const mockGoogle = mocked(google.maps, true);
const mockGmap = mocked(MapService, true);

const removeEventListener = jest.fn();

jest.spyOn(mockGmap.map, 'addListener').mockImplementation((event, handler) => {
  return {remove: removeEventListener};
});

jest
  .spyOn(mockGoogle.event, 'addListenerOnce')
  .mockImplementation((_, event, handler) => {
    return {remove: removeEventListener};
  });

afterEach(() => {
  jest.clearAllMocks();
});

describe('Play page', () => {
  it('renders', () => {
    const state = createMockState();
    const store = createMockStore(state);
    const {container} = render(<Play />);
    let button = screen.queryByRole('button', {name: /submit/i});
    expect(button).toBeDisabled();
    store.dispatch(updateSelectedPosition);
    button = screen.queryByRole('button', {name: /submit/i});

    expect(container).toMatchSnapshot();

    expect(button).toBeInTheDocument();
  });
});
