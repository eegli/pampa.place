import { Status, Wrapper } from '@googlemaps/react-wrapper';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import type { AppProps } from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import { GoogleMapRoot } from '../components/google/google.map';
import { GoogleSVRoot } from '../components/google/google.street-view';
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
