import { Status, Wrapper } from '@googlemaps/react-wrapper';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import type { AppProps } from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import Spinner from '../components/spinner';
import { store } from '../redux/store';
import '../styles/root.css';

const devAPIKey = process.env.NEXT_PUBLIC_MAPS_API_KEY || '';
const prodAPIKey = 'AIzaSyBmN_jY6YeqgNx3bGeb4m5i-a3j0daDR0k';

const APIKEY = process.env.NODE_ENV === 'production' ? prodAPIKey : devAPIKey;

const render = (status: Status) => {
  if (status === Status.LOADING) return <Spinner />;
  if (status === Status.FAILURE) return <div>Error</div>;
  return <div />;
};

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.StrictMode>
      <Wrapper
        apiKey={APIKEY}
        render={render}
        libraries={['drawing', 'geometry', 'places', 'visualization']}>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        </Provider>
      </Wrapper>
    </React.StrictMode>
  );
}
export default MyApp;
