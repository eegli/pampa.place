import {store} from '@/redux/store';
import {GmapContainer, GstvContainer} from '@/services/google';
import {RootContainer} from '@/styles/containers';
import '@/styles/global/index.css';
import {createEmotionCache} from '@/styles/utils';
import {EmotionCache} from '@emotion/react';
import type {AppProps} from 'next/app';
import {Provider} from 'react-redux';
import {initAnalytics} from '../lib/analytics';
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
const GoogleAnalytics = initAnalytics();

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
            <RootContainer>
              <Component {...pageProps} />
            </RootContainer>
          </AuthWrapper>
        </ThemeWrapper>
      </Provider>
    </>
  );
};

export default App;
