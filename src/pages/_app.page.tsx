import {GmapContainer, GstvContainer} from '@/services/google';
import type {AppProps, NextWebVitalsMetric} from 'next/app';
import {Provider} from 'react-redux';
import LoadingProgress from '../components/feedback/feedback.progress';
import {store} from '../redux/redux.store';
import {AuthWrapper} from './wrappers/auth.wrapper';
import {ThemeWrapper} from './wrappers/theme.wrapper';

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
