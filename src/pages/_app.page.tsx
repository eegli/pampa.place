import {GmapContainer, GstvContainer} from '@/services/google';
import createCache from '@emotion/cache';
import {CacheProvider, EmotionCache} from '@emotion/react';
import type {AppProps, NextWebVitalsMetric} from 'next/app';
import {Provider} from 'react-redux';
import {LoadingProgress} from '../components/feedback/progress';
import {store} from '../redux/store';
import {AuthWrapper} from './wrappers/auth';
import {ThemeWrapper} from './wrappers/theme';

export function reportWebVitals(metric: NextWebVitalsMetric) {
  console.info({
    env: process.env.NODE_ENV,
    metric,
  });
}

type ExtendedAppProps = AppProps & {emotionCache: EmotionCache};

const App = ({
  Component,
  pageProps,
  emotionCache = createCache({key: 'css'}),
}: ExtendedAppProps) => {
  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <ThemeWrapper>
          <LoadingProgress />
          <GmapContainer />
          <GstvContainer />
          <AuthWrapper>
            <Component {...pageProps} />
          </AuthWrapper>
        </ThemeWrapper>
      </CacheProvider>
    </Provider>
  );
};
export default App;
