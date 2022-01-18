/* DO use the original renderer */
import {render} from '@testing-library/react';
import {initAnalytics} from './analytics';

describe('Analytics initialization', () => {
  it('returns null if tracking ID is not set', () => {
    expect(process.env.NEXT_PUBLIC_GA_ID).toBeUndefined();
    const Script = initAnalytics();
    render(<Script />);
    expect(document.body).toMatchInlineSnapshot(`
      <body>
        <div />
      </body>
    `);
  });
  it('returns script tag if tracking ID is set', () => {
    process.env.NEXT_PUBLIC_GA_ID = 'test';
    expect(process.env.NEXT_PUBLIC_GA_ID).toBe('test');
    const Script = initAnalytics();
    render(<Script />);
    expect(document.body).toMatchInlineSnapshot(`
      <body>
        <div />
        <script
          data-nscript="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=test"
        />
        <script
          data-nscript="afterInteractive"
          id="ga-script"
        >
          
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'test', {
            page_path: window.location.pathname,
          });
        
        </script>
      </body>
    `);
  });
});
