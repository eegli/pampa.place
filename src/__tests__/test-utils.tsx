import { configureStore } from '@reduxjs/toolkit';
import { render, RenderOptions } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { rootReducer } from '../redux/store';

type DeepPartial<T> = T extends Function
  ? T
  : T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

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
    return <Provider store={providerStore}>{children}</Provider>;
  };

  return render(ui, {
    wrapper: Wrapper,
    ...options,
  });
};

export * from '@testing-library/react';
export { customRender as render };
