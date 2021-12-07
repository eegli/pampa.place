import {GmapContainer, GstvContainer} from '@/services/google';
import type {AppProps, NextWebVitalsMetric} from 'next/app';
import {Provider} from 'react-redux';
import {LoadingProgress} from '../components/feedback/progress';
import {store} from '../redux/store';
import {AuthWrapper} from './wrappers/auth';
import {ThemeWrapper} from './wrappers/theme';

export function reportWebVitals(metric: NextWebVitalsMetric) {
  // console.log(metric);
}

const App = ({Component, pageProps}: AppProps) => {
  return (
    <Provider store={store}>
      <LoadingProgress />
      <ThemeWrapper>
        <GmapContainer />
        <GstvContainer />
        <AuthWrapper>
          <Component {...pageProps} />
        </AuthWrapper>
      </ThemeWrapper>
    </Provider>
  );
};
export default App;
