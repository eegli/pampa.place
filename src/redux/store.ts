import {configureStore, StateFromReducersMapObject} from '@reduxjs/toolkit';
import {createLogger} from 'redux-logger';
import app from './app';
import game from './game';
import {eventLogger, windowStorage} from './middlewares';
import position from './position';

const reducer = {
  position: position.reducer,
  app: app.reducer,
  game: game.reducer,
};

const logger = createLogger();

const isDev = process.env.NODE_ENV === 'development';
const devMiddleware = [logger, windowStorage, eventLogger];
const prodMiddleware = [windowStorage, eventLogger];

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
