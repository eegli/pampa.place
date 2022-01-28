import {useRouter} from 'next/router';
import Script from 'next/script';
import {useEffect} from 'react';
import {pageview} from './analytics-events';

export const initAnalytics = () => {
  const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

  if (!GA_TRACKING_ID) {
    return () => null;
  }

  const debugMode = process.env.NEXT_PUBLIC_DEBUG_ANALYTICS === 'true';

  return function GoogleAnalytics() {
    const router = useRouter();

    useEffect(() => {
      const handleRouteChange = (url: string) => pageview(url);
      router.events.on('routeChangeComplete', handleRouteChange);
      return () => {
        router.events.off('routeChangeComplete', handleRouteChange);
      };
    }, [router.events]);
    const debug = debugMode ? ", '{debug_mode: true}'" : '';

    return (
      <>
        <Script
          id="ga"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <Script
          id={`ga-script${debugMode ? '-debug' : ''}`}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}'${debug});`,
          }}
        />
      </>
    );
  };
};
