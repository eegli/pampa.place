/* DO use the original renderer */
import {render} from '@testing-library/react';
import {initAnalytics} from './analytics';

beforeEach(() => {
  delete process.env.NEXT_PUBLIC_GA_ID;
});

describe('Analytics initialization', () => {
  it('returns null if tracking ID is not set', () => {
    expect(process.env.NEXT_PUBLIC_GA_ID).toBeUndefined();

    const Script = initAnalytics();
    render(<Script />);
    expect(document.body).toMatchSnapshot();
  });
  it('returns script tag if tracking ID is set', () => {
    process.env.NEXT_PUBLIC_GA_ID = 'test-id';
    expect(process.env.NEXT_PUBLIC_GA_ID).toBe('test-id');

    const Script = initAnalytics();
    render(<Script />);
    expect(document.body).toMatchSnapshot();
  });
});
