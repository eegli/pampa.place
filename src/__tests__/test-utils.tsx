import { configureStore } from '@reduxjs/toolkit';
import { render, RenderOptions } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { GoogleMapRoot } from '../components/google/google.map';
import { GoogleSVRoot } from '../components/google/google.street-view';
import { ThemeWrapper } from '../pages/_app.page';
import { rootReducer } from '../redux/store';

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
        <ThemeWrapper>
          <GoogleMapRoot />
          <GoogleSVRoot />
          {children}
        </ThemeWrapper>
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
