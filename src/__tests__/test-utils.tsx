import { configureStore } from '@reduxjs/toolkit';
import { render, RenderOptions } from '@testing-library/react';
import { FC, ReactElement } from 'react';
import { Provider } from 'react-redux';
import { ThemeWrapper } from '../pages/wrappers/theme.wrapper';
import { rootReducer } from '../redux/redux.store';
import { GmapContainer } from '../services/google-map';
import { GstvContainer } from '../services/google-sv';

export function createMockStore() {
  return configureStore({
    reducer: rootReducer,
  });
}

const customRender = (
  ui: ReactElement,
  store?: ReturnType<typeof createMockStore>,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const providerStore = store || createMockStore();

  const Wrapper: FC = ({ children }) => {
    return (
      <Provider store={providerStore}>
        <ThemeWrapper>
          <GmapContainer />
          <GstvContainer />
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
