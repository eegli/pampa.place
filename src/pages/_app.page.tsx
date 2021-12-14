import {GmapContainer, GstvContainer} from '@/services/google';
import createCache from '@emotion/cache';
import {CacheProvider, EmotionCache} from '@emotion/react';
import type {AppProps} from 'next/app';
import {Provider} from 'react-redux';
import {store} from '../redux/store';
import {AuthWrapper} from './wrappers/auth';
import {ThemeWrapper} from './wrappers/theme';

/* export function reportWebVitals(metric: NextWebVitalsMetric) {
  console.info({
    env: process.env.NODE_ENV,
    metric,
  });
} */

type ExtendedAppProps = AppProps & {emotionCache: EmotionCache};

const clientEmotionCache = createCache({key: 'css'});

const App = ({
  Component,
  pageProps,
  emotionCache = clientEmotionCache,
}: ExtendedAppProps) => {
  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <ThemeWrapper>
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
