import { Status, Wrapper } from '@googlemaps/react-wrapper';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import Spinner from 'src/components/spinner';
import { useAppSelector } from 'src/redux/hooks';
import { PageContentContainer } from 'src/styles';
import Home from '.';
import { store } from '../redux/store';
import '../styles/root.css';
import Login from './login';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

// Redirects the user to home if the game has not been properly initialized
const AuthWrapper: NextPage = ({ children }) => {
  const apiKey = useAppSelector(s => s.app.apiKey);

  if (!apiKey) {
    return <Login />;
  }

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

  return (
    <Wrapper
      apiKey={apiKey}
      render={render}
      libraries={['drawing', 'geometry', 'places', 'visualization']}
    />
  );
};

const GameWrapper: NextPage = ({ children }) => {
  const initialized = useAppSelector(s => s.game.initialized);
  if (!initialized) {
    return <Home />;
  }

  return <>{children}</>;
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthWrapper>
          <GameWrapper>
            <Component {...pageProps} />
          </GameWrapper>
        </AuthWrapper>
      </ThemeProvider>
    </Provider>
  );
}
