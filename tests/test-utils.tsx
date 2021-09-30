import { ThemeProvider } from '@mui/material';
import { configureStore } from '@reduxjs/toolkit';
import { render, RenderOptions } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { GoogleMapRoot } from '../src/components/google/google.map';
import { GoogleSVRoot } from '../src/components/google/google.street-view';
import { theme } from '../src/pages/_app';
import { rootReducer } from '../src/redux/store';

export function createMockStore() {
  return configureStore({
    reducer: rootReducer,
  });
}

const customRender = (
  ui: React.ReactElement,
  store?: ReturnType<typeof createMockStore>,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const providerStore = store || createMockStore();

  const Wrapper: React.FC = ({ children }) => {
    return (
      <Provider store={providerStore}>
        <ThemeProvider theme={theme}>
          <GoogleMapRoot />
          <GoogleSVRoot />
          {children}
        </ThemeProvider>
      </Provider>
    );
  };

  return render(ui, {
    wrapper: Wrapper,
    ...options,
  });
};

export * from '@testing-library/react';
export { customRender as render };
