import {
  AnyAction,
  configureStore,
  Middleware,
  StateFromReducersMapObject,
  ThunkDispatch,
} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import app from './app';
import game from './game';
import position from './position';

const reducer = {
  position: position.reducer,
  app: app.reducer,
  game: game.reducer,
};

export const initialStates = {
  position: position.reducer(undefined, {type: '@@INIT'}),
  app: app.reducer(undefined, {type: '@@INIT'}),
  game: game.reducer(undefined, {type: '@@INIT'}),
};

const testMiddleware: Middleware<
  {},
  unknown,
  ThunkDispatch<unknown, unknown, AnyAction>
> =
  ({dispatch}) =>
  next =>
  async action => {
    console.log(action);
    return next(action);
  };

const isDev = process.env.NODE_ENV === 'development';
const devMiddleware = [logger];

export function createStore(preloadedState?: RootState) {
  return configureStore({
    reducer,
    preloadedState,
    devTools: false,
    middleware: getDefault =>
      isDev ? getDefault().concat(devMiddleware) : getDefault(),
  });
}

export const store = createStore();

export type AppDispatch = typeof store.dispatch;
export type RootState = StateFromReducersMapObject<typeof reducer>;
