import React from 'react';
import Form from '../components/form/form';
import GoogleStreetView from '../components/google/google.street-view';
import { render } from './test-utils';

describe('it tests', () => {
  it('renders', async () => {
    const { container } = render(<Form />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('streetview', () => {
    const { container } = render(<GoogleStreetView />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
