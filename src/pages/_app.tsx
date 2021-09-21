import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import type { AppProps } from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import GoogleWrapper from '../google-wrapper';
import { store } from '../redux/store';
import '../styles/root.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GoogleWrapper>
          <Component {...pageProps} />
        </GoogleWrapper>
      </ThemeProvider>
    </Provider>
  );
}
export default MyApp;
