import { configureStore } from '@reduxjs/toolkit';
import { render, RenderOptions } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { rootReducer } from '../redux/store';

const AllTheProviders: React.FC = ({ children }) => {
  return (
    <Provider store={configureStore({ reducer: rootReducer })}>
      {children}
    </Provider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
