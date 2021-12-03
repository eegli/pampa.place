import {GmapContainer, GstvContainer} from '@/services/google';
import {DeepPartial} from '@/utils/types';
import {render, RenderOptions} from '@testing-library/react';
import {merge} from 'lodash';
import {FC, ReactElement} from 'react';
import {Provider} from 'react-redux';
import {ThemeWrapper} from '../pages/wrappers/theme.wrapper';
import {createStore, initialStates, RootState} from '../redux/store';

function customRender(
  ui: ReactElement,
  store: ReturnType<typeof createStore> = createStore(),
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const Wrapper: FC = ({children}) => {
    return (
      <Provider store={store}>
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
}

function createMockState(state: DeepPartial<RootState> = {}): RootState {
  return merge({}, initialStates, state);
}

export * from '@testing-library/react';
export {customRender as render};
/*
createMockState and createMockStore can be used together. Create a
state from the defined initial state, enrich it and pass it to
createMockStore.
*/
export {createStore as createMockStore};
export {createMockState};
