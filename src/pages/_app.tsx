import { Status, Wrapper } from '@googlemaps/react-wrapper';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import type { AppProps } from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import Login from '../components/login';
import LoadingProgress from '../components/progress';
import Spinner from '../components/spinner';
import { useAppSelector } from '../redux/hooks';
import { store } from '../redux/store';
import { PageContentContainer } from '../styles';
import GlobalStyles from '../styles/global';

export const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export const GoogleMapRoot = () => {
  return (
    <>
      <div
        id="__GMAP__"
        style={{ width: '100%', height: '100%', display: 'none' }}
      />
      <div id="__GMAP_PARKING__" />
    </>
  );
};

export const GoogleSVRoot = () => {
  return (
    <div
      id="__GSTV__"
      style={{ width: '100%', height: '100%', display: 'none' }}
    />
  );
};

export let GLOBAL_MAP: google.maps.Map;
export let GLOBAL_SV: google.maps.StreetViewPanorama;

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const apiKey = useAppSelector(s => s.app.apiKey);
  if (!apiKey) return <Login />;

  const render = (status: Status) => {
    if (status === Status.LOADING)
      return (
        <PageContentContainer height="100%">
          <Spinner />
        </PageContentContainer>
      );
    // Failures are not captured as of now
    else if (status === Status.FAILURE)
      return (
        <PageContentContainer height="100%">
          <div>fail</div>
        </PageContentContainer>
      );

    // All good, create global instances that can be reused
    const MAP_ROOT = document.getElementById('__GMAP__')!;
    const SV_ROOT = document.getElementById('__GSTV__')!;

    GLOBAL_MAP ??= new google.maps.Map(MAP_ROOT);
    GLOBAL_SV ??= new google.maps.StreetViewPanorama(SV_ROOT);
    console.log('Created new global Map instance');
    console.log('Created new global SV instance');
    return <>{children}</>;
  };

  return <Wrapper apiKey={apiKey} render={render} />;
};

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GoogleMapRoot />
        <GoogleSVRoot />
        <GlobalStyles />
        <CssBaseline />
        <LoadingProgress />
        <AuthWrapper>
          <Component {...pageProps} />
        </AuthWrapper>
      </ThemeProvider>
    </Provider>
  );
};
export default App;
