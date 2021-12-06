import {
  configureStore,
  Middleware,
  StateFromReducersMapObject,
} from '@reduxjs/toolkit';
import {createLogger} from 'redux-logger';
import app from './app';
import game from './game';
import position from './position';

const reducer = {
  position: position.reducer,
  app: app.reducer,
  game: game.reducer,
};

const logger = createLogger({
  diff: true,
});

const localStorage: Middleware<{}, RootState> = () => next => action => {
  if (action.type.includes('setApiKey')) {
    window.sessionStorage.setItem('gapikey', JSON.stringify(action.payload));
  }
  return next(action);
};

const isDev = process.env.NODE_ENV === 'development';
const devMiddleware = [logger, localStorage];
const prodMiddleware = [localStorage];

export const initialStates = {
  position: position.reducer(undefined, {type: '@@INIT'}),
  app: app.reducer(undefined, {type: '@@INIT'}),
  game: game.reducer(undefined, {type: '@@INIT'}),
};

export function createStore(preloadedState?: RootState) {
  return configureStore({
    reducer,
    preloadedState,
    devTools: false,
    middleware: getDefault =>
      isDev
        ? getDefault().concat(devMiddleware)
        : getDefault().concat(prodMiddleware),
  });
}

export const store = createStore();

export type AppDispatch = typeof store.dispatch;
export type RootState = StateFromReducersMapObject<typeof reducer>;
