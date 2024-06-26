import {GmapContainer, GstvContainer} from '@/services/google';
import {createEmotionCache} from '@/styles/utils/index';
import {DeepPartial} from '@/utils/types';
import {render, RenderOptions} from '@testing-library/react';
import {merge} from 'lodash';
import React, {ReactElement, ReactNode} from 'react';
import {Provider} from 'react-redux';
import {ThemeWrapper} from '../src/pages/wrappers/theme';
import {createStore, initialStates, RootState} from '../src/redux/store';

const emotionCache = createEmotionCache();

function customRender(
  ui: ReactElement,
  store: ReturnType<typeof createStore> = createStore(),
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const Wrapper = ({children}: {children: ReactNode}) => {
    return (
      <Provider store={store}>
        <ThemeWrapper emotionCache={emotionCache}>
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
}

const createMockState = (
  partialState: DeepPartial<RootState> = {}
): RootState => {
  if (!Object.keys(partialState).length) return initialStates;
  return merge({}, initialStates, partialState);
};

export * from '@testing-library/react';
export {customRender as render};
// createMockState and createMockStore can be used together. Create a
// state from the defined initial state, enrich it and pass it to
// createMockStore.
export {createStore as createMockStore};
export {createMockState};
export {initialStates as __actualInitialAppState};
