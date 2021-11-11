import {CssBaseline} from '@mui/material';
import type {AppProps, NextWebVitalsMetric} from 'next/app';
import {Provider} from 'react-redux';
import LoadingProgress from '../components/progress';
import {store} from '../redux/redux.store';
import {GmapContainer} from '../services/google-map';
import {GstvContainer} from '../services/google-sv';
import GlobalStyles from '../styles/global';
import {AuthWrapper} from './wrappers/auth.wrapper';
import {ThemeWrapper} from './wrappers/theme.wrapper';

export function reportWebVitals(metric: NextWebVitalsMetric) {
  // console.log(metric);
}

const App = ({Component, pageProps}: AppProps) => {
  return (
    <Provider store={store}>
      <ThemeWrapper>
        <GmapContainer />
        <GstvContainer />
        <GlobalStyles />
        <CssBaseline />
        <LoadingProgress />
        <AuthWrapper>
          <Component {...pageProps} />
        </AuthWrapper>
      </ThemeWrapper>
    </Provider>
  );
};
export default App;
