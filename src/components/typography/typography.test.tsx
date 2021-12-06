import {render} from '@/tests/utils';
import React from 'react';
import {FancyRetroTitle} from './retro-title';

describe('Typography', () => {
  it('renders retro title', () => {
    const {container} = render(
      <FancyRetroTitle primary="Retro" secondary="Title" />
    );
    expect(container.firstChild?.lastChild).toMatchSnapshot();
  });
});
