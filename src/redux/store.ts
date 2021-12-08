import {Constants} from '@/config/constants';
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

const logger = createLogger();

const windowStorage: Middleware<{}, RootState> = state => next => action => {
  if (action.type.includes('setApiKey') && typeof action.payload === 'string') {
    window.sessionStorage.setItem(Constants.SESSION_APIKEY_KEY, action.payload);
  }
  if (action.type.includes('setTheme')) {
    window.localStorage.setItem(Constants.THEME_KEY, action.payload);
  }
  return next(action);
};

const isDev = process.env.NODE_ENV === 'development';
const devMiddleware = [logger, windowStorage];
const prodMiddleware = [windowStorage];

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
