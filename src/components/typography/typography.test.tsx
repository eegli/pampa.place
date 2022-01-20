/* eslint-disable testing-library/no-node-access  */

import {render} from '@testing-library/react';
import React from 'react';
import {FancyRetroTitle} from './headings/retro-title';

describe('Typography', () => {
  it('renders retro title', () => {
    const {container} = render(
      <FancyRetroTitle primary="Retro" secondary="Title" />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
