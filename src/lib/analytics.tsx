import {useRouter} from 'next/router';
import Script from 'next/script';
import {useEffect} from 'react';

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

export const GoogleAnalytics = () => {
  if (!GA_TRACKING_ID) {
    return null;
  }

  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      window.gtag('config', GA_TRACKING_ID, {
        page_path: url,
      });
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GA_TRACKING_ID}', {
    page_path: window.location.pathname,
  });
`,
        }}
      />
    </>
  );
};
