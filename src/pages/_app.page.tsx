import {GmapContainer, GstvContainer} from '@/services/google';
import {EmotionCache} from '@emotion/react';
import type {AppProps} from 'next/app';
import {Provider} from 'react-redux';
import {GoogleAnalytics} from '../lib/analytics';
import {store} from '../redux/store';
import {createEmotionCache} from '../styles/ssr';
import {AuthWrapper} from './wrappers/auth';
import {ThemeWrapper} from './wrappers/theme';

/* export function reportWebVitals(metric: NextWebVitalsMetric) {
  console.info({
    env: process.env.NODE_ENV,
    metric,
  });
} */

type ExtendedAppProps = AppProps & {emotionCache: EmotionCache};

const clientSideEmotionCache = createEmotionCache();

const App = ({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: ExtendedAppProps) => {
  return (
    <>
      <GoogleAnalytics />
      <Provider store={store}>
        <ThemeWrapper emotionCache={emotionCache}>
          <GmapContainer />
          <GstvContainer />
          <AuthWrapper>
            <Component {...pageProps} />
          </AuthWrapper>
        </ThemeWrapper>
      </Provider>
    </>
  );
};
export default App;
