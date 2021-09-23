import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/dist/client/router';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { isInitialized } from 'src/redux/game';
import { useAppSelector } from 'src/redux/hooks';
import GoogleAuthWrapper from '../app/app.auth';
import { store } from '../redux/store';
import '../styles/root.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

// Redirects the user to home if the game has not been properly initialized
function InitRedirect() {
  const router = useRouter();
  const gameInitialized = useAppSelector(isInitialized);

  useEffect(() => {
    if (!gameInitialized) {
      router.push('/');
    }
  }, [router.pathname]);
  return <></>;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <InitRedirect />
        <GoogleAuthWrapper>
          <Component {...pageProps} />
        </GoogleAuthWrapper>
      </ThemeProvider>
    </Provider>
  );
}
