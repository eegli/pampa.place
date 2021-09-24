import React from 'react';
import Form from '../components/form/form';
import { fireEvent, render, screen } from './test-utils';

describe('Form', () => {
  it('player inputs', async () => {
    const { container } = render(<Form />);
    expect(container.firstChild).toMatchSnapshot();

    expect(screen.getAllByLabelText(/^player /i)).toHaveLength(1);

    const input = screen.getByTestId(/^player-input-1/i);
    fireEvent.change(input, { target: { value: 'eric' } });
    expect(container.firstChild).toMatchSnapshot();
    expect(screen.getAllByLabelText(/^player /i)).toHaveLength(2);
  });
});
