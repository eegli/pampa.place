import {StreetViewService} from '@/services/google';
import {render, screen} from '@/tests/test-utils';
import React from 'react';
import {mocked} from 'ts-jest/utils';
import {GoogleStreetView} from '../street-view';

const mockSv = mocked(StreetViewService, true);

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('Google Street view', () => {
  it('renders and has containers in document', () => {
    render(<GoogleStreetView />);
    expect(screen.getByTestId('__GSTV__CONTAINER__')).toBeInTheDocument();
    expect(screen.getByTestId('__GSTV__')).toHaveStyle('height:100%');
  });
  it('has game mode', () => {
    render(<GoogleStreetView />);
    expect(mockSv.sv.setPano).toHaveBeenCalledTimes(1);
    expect(mockSv.sv.setOptions.mock.calls[0][0]).toMatchSnapshot(
      'options default'
    );
  });
  it('has static review mode', () => {
    render(<GoogleStreetView staticPos />);
    expect(mockSv.sv.setPano).toHaveBeenCalledTimes(1);
    expect(mockSv.sv.setOptions.mock.calls[0][0]).toMatchSnapshot(
      'options static'
    );
  });
});
